import { Box, Container, Grid, Link, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const VideoPage = () => {
  const classNames = useStyles();
  const history = useHistory();
  const [_, setCookie] = useCookies();

  const videoWatched = () => {
    setCookie('videoWatched', 1);
    history.push(`/airdrop`);
  };

  const brightToken = (
    <Typography color={'primary'} display={'inline'} variant={'inherit'}>
      $BRIGHT
    </Typography>
  );

  const brightDAO = (
    <Typography color={'primary'} display={'inline'} variant={'inherit'}>
      Bright DAO
    </Typography>
  );

  return (
    <Container maxWidth="lg">
      <Grid
        container
        alignItems={'center'}
        className={classNames.videoContainer}
        justifyContent={'center'}
        spacing={2}
      >
        <Grid item md={10} sm={11} xs={12} className={classNames.videoHeader}>
          <Typography variant={'h4'}>
            Please watch this video about {brightToken} and {brightDAO}
          </Typography>
        </Grid>
        <Grid item md={11} sm={12} xs={12}>
          <Box className={classNames.videoBorder}>
            <Box className={classNames.videoBox}>
              <iframe
                className={classNames.video}
                src="https://www.youtube.com/embed/C8rA9oxw4Zk?rel=0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                frameBorder="0"
              />
            </Box>
          </Box>
        </Grid>
        <Grid item md={11} sm={12} xs={12}>
          <Typography
            variant={'h5'}
            className={classNames.centered}
            gutterBottom={true}
          >
            <Link
              href={'https://brightid.gitbook.io/bright/what-is-bright/'}
              rel={'noreferrer noopener'}
              target={'_blank'}
            >
              Learn more
            </Link>{' '}
            about $BRIGHT and Bright DAO
          </Typography>
          <Typography variant={'h6'} className={classNames.centered}>
            I've seen the video. Now take me to the{' '}
            <Link href={'#'} onClick={videoWatched}>
              Fairdrop
            </Link>
            !
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    videoContainer: {
      padding: theme.spacing(2),
      paddingTop: theme.spacing(1),
    },
    videoHeader: {
      textAlign: 'center',
    },
    centered: {
      textAlign: 'center',
    },
    videoBorder: {
      backgroundColor: theme.palette.common.white,
      borderWidth: '10px',
      borderRadius: '20px',
      padding: theme.spacing(2),
    },
    videoBox: {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      paddingTop: '56.25%' /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */,
    },
    video: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      height: '100%',
    },
  })
);

export default VideoPage;
