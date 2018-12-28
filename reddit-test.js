
function redditOauthHelper() {


  this.doStuff = async function() {
    return this.fetchAnonymousToken().then(data => { t = data })
  },



  this.fetchAnonymousToken = function() {
    // const form = new FormData();
    // form.set('grant_type', 'client_credentials');
    // form.set('grant_type', 'https://oauth.reddit.com/grants/installed_client');
    // form.set('device_id', 'DO_NOT_TRACK_THIS_DEVICE');
    return fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'post',
      body: 'grant_type=client_credentials',
      headers: { 'User-Agent': 'parser script test by /u/Multiheaded',
        Authorization: `Basic ${btoa("EstherScript" + ':' + '3QxBlxLLHLxwDB1xTQlyAC1nN20')}`
      },
      credentials: 'omit'
      // mode: 'no-cors'
    }).then(response => response.text())
    // .then(JSON.parse)
    .then((tokenInfo) => {
      console.log(tokenInfo)
      return tokenInfo.access_token})
    .then(anonymousToken => {
      return anonymousToken;
    });
  }
}

// window.logData =function(){
  test = new redditOauthHelper();
//   test.doStuff();
//   console.log(test);
//   setTimeout(test.sn(), 1000);
// };
// logData();
