import { useState, useEffect } from "react";
import { getRemainingTimeUntilMsTimestamp } from "../../Utils";
import { Box, Paper, Typography, Grid, BottomNavigation, Button } from "@mui/material";
import { RegisterButton } from "../Buttons/RegisterButton";
import { LoginButton } from "../Buttons/LoginButton";
import styled from "@emotion/styled";

const defaultRemainingTime = {
  seconds: "00",
  minutes: "00",
  hours: "00",
  days: "00",
};

export const CountdownTimer = ({ countdownTimestampMs }) => {
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateRemainingTime(countdownTimestampMs);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [countdownTimestampMs]);

  function updateRemainingTime(countdown) {
    setRemainingTime(getRemainingTimeUntilMsTimestamp(countdown));
  }
  

  return (
    <>
      <Box
        sx={{
          display: {xs:'flex',sm:'flex' },
          flexWrap: "wrap",
          position: 'absolute',
          width:'50%',
          height:'60%',
          justifyContent:{xs:'center',sm:'left'},
          top:{xs:'2%',sm:'10%', md:'20%'},
          ml:{xs:`calc(20%)`,sm:`calc(4%)`, md:`calc(20%)`, lg:`calc(30%)`, xl:`calc(35%)`},
        }}
        
      >
        <Box
          sx={{
            mt:{xs:'110px'},
            display:{xs:'block', sm:'flex'} ,
            flexWrap: 'nowrap',
            justifyContent:'center',
            "& > :not(style)": {
              width: 100,
              height: 130,
              
            }
          }}
        > 
          
          <Grid
          position={'static'} 
          ml={{xs:3, md:-10}}
          >
            <Paper
              sx={{
                minHeight:{xs:'120px',sm:'130px', md:'180px'}, 
                minWidth: {xs:'120px',sm:'130px', md:'180px'},
                opacity: 0.5,
                padding: "2px",
                position: "absolute",
                
              }}
              elevation={24}
              
            ></Paper>
            <Typography
              paddingLeft={{xs:'25px',md:'35px'}}
              paddingTop={{xs:'2'}}
              position={"absolute"}
              color="black"
              fontSize={{xs:50, md:80}}
            >
              {remainingTime.days}
            </Typography>
            <Typography
              paddingLeft={{xs:4, md:'50px'}}
              paddingTop={{xs:'60px',md:'100px'}}
              position={"absolute"}
              fontSize={{xs:30, md:40}}
            >
              Días
            </Typography>
          </Grid>

          <Grid
          position={'relative'} 
          ml={{xs:3,sm:5, md:12 }}
          >
            <Paper
              sx={{
                minHeight:{xs:'120px',sm:'130px', md:'180px'}, 
                minWidth: {xs:'120px',sm:'130px', md:'180px'},
                opacity: 0.5,
                padding: "2px",
                position: "absolute",
                
              }}
              elevation={24}
            ></Paper>
            <Typography
              paddingLeft={{xs:'25px',md:'47px'}}
              paddingTop={{xs:'2'}}
              position={"absolute"}
              color="black"
              fontSize={{xs:50, md:80}}
            >
              {remainingTime.hours}
            </Typography>
            <Typography
              paddingLeft={{xs:'18px', md:'42px'}}
              paddingTop={{xs:'60px',md:'100px'}}
              position={"absolute"}
              fontSize={{xs:30, md:40}}
            >
              Horas
            </Typography>
          </Grid>

          <Grid
          position={'relative'} 
          ml={{xs:3,sm:5, md:12 }}
          >
            <Paper
              sx={{
                minHeight:{xs:'120px',sm:'130px', md:'180px'}, 
                minWidth: {xs:'120px',sm:'130px', md:'180px'},
                opacity: 0.5,
                padding: "2px",
                position: "absolute",
                
              }}
              elevation={24}
            ></Paper>
            <Typography
              paddingLeft={{xs:'25px',md:'47px'}}
              paddingTop={{xs:'2'}}
              position={"absolute"}
              color="black"
              fontSize={{xs:50, md:80}}
            >
              {remainingTime.minutes}
            </Typography>
            <Typography
              paddingLeft={{xs:'9px', md:'22px'}}
              paddingTop={{xs:'60px',md:'100px'}}
              position={"absolute"}
              fontSize={{xs:30, md:40}}
            >
              Minutos
            </Typography>
          </Grid>

          <Grid
          position={'relative'} 
          ml={{xs:3,sm:5, md:12 }}
          >
            <Paper
              sx={{
                minHeight:{xs:'120px',sm:'130px', md:'180px'}, 
                minWidth: {xs:'120px',sm:'130px',md:'180px'},
                opacity: 0.5,
                padding: "2px",
                position: "absolute",
                
              }}
              elevation={24}
            ></Paper>
            <Typography
              paddingLeft={{xs:'25px',md:'47px'}}
              paddingTop={{xs:'2'}}
              position={"absolute"}
              color="black"
              fontSize={{xs:50, md:80}}
            >
              {remainingTime.seconds}
            </Typography>
            <Typography
              paddingLeft={{xs:'0px',md:'10px'}}
              paddingTop={{xs:'60px',md:'100px'}}
              position={"absolute"}
              fontSize={{xs:30, md:40}}
            >
              Segundos
            </Typography>
          </Grid>
          <Grid width={'100%'} mt={{xs:`calc(2%)`,sm:`calc(50%)`, md:`calc(70%)`}} ml={{xs:'-30px', sm:'-350px', md:'-400px'}}
           container spacing={1}>  
            <RegisterButton />
          </Grid>
        </Box>
      </Box>
    </>
  );
};
