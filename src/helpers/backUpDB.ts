import { spawn } from "child_process";
import { config } from "../../config";
import path from "path";
import fs from "fs";
import { S3Service } from "../shared/infrastructure/aws/S3Service";
// Función para ejecutar comandos con `spawn`
const execSpawn = (command: any, args: any) => {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args);
      
      child.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });
      
      child.stderr.on("data", (data) => {
        console.error(`stderr: ${Buffer.from(data).toString()}`);
      });
      
      child.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`El proceso terminó con código ${code}`));
        } else {
          resolve();
        }
      });
    });
  };
export const backUpDBToS3 = async () => {
    const s3Service : S3Service = new S3Service();
    const DATABASE_URI = config.APP_DATABASE_URL    
    const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-");
    const ARCHIVE_PATH = path.join(__dirname, `backup-${TIMESTAMP}.gzip`);
    const S3_KEY = `backups/backup-${TIMESTAMP}.gzip`;

    try{     
        console.log("📦 Iniciando backup...");
        // necesario tener instalado mongo db tools en el servidor para usar mongodump
        await execSpawn('mongodump', [
          `--uri=${DATABASE_URI}`,
          `--archive=${ARCHIVE_PATH}`,
          '--gzip',
        ]);         
        console.log(`✅ Backup creado y comprimido en ${ARCHIVE_PATH}`);        
        const fileStream = fs.createReadStream(ARCHIVE_PATH);
        await s3Service.uploadBackUpToS3(fileStream, S3_KEY);    
        console.log(`✅ Backup subido a S3`);
        // Eliminar el archivo de backup local después de subirlo
        fs.unlinkSync(ARCHIVE_PATH);
        console.log("🗑️ Backup local eliminado.");                  
    }catch(error){
        console.log("backup error" + error);        
    }

}


  



