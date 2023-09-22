
async function scrapChapters() {
  var myHeaders = new Headers();
  myHeaders.append("X-RapidAPI-Host", "bhagavad-gita3.p.rapidapi.com");
  myHeaders.append("X-RapidAPI-Key", "7f0ee1c29fmsh3ec28fd11ebc466p14db79jsnc7c9e3acf008");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  var res = await fetch("https://bhagavad-gita3.p.rapidapi.com/v2/chapters/?limit=18", requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

  return res;
}


async function scrapVerse(chapterId) {
  console.log(`Scraping Chapter ${chapterId}`);
  var myHeaders = new Headers();
  myHeaders.append("X-RapidAPI-Host", "bhagavad-gita3.p.rapidapi.com");
  myHeaders.append("X-RapidAPI-Key", "7f0ee1c29fmsh3ec28fd11ebc466p14db79jsnc7c9e3acf008");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  var res = await fetch(`https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterId}/verses/`, requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));
  return res;

}


async function completeScrapData() {
  var chapters = await scrapChapters();
  for (var i = 0; i < chapters.length; i++) {
    var ch = chapters[i];
    var vr = await scrapVerse(ch.id);
    chapters[i]["verses"] = vr;
  }
  const file = Bun.file('./data.json');
  await Bun.write(file, JSON.stringify(chapters));

}

completeScrapData();