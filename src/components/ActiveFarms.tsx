import React from 'react';
import { Grid } from '@material-ui/core';
import FarmingBox from './FarmingBox';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const ActiveFarms = () => {
  const classes = useStyles();

  return (
    <>
      <Grid
        item
        sm={12}
        md={6}
        lg={4}
        className={classes.farmContainer}
        container
      >
        <FarmingBox farm={'SUBS'} />
      </Grid>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    farmContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 470,
    },
  })
);

export default ActiveFarms;
