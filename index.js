import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

const app = new Elysia().use(cors());
const file = Bun.file('./data.json');

function theChecker(context){
  var req = context.request;
  var apiKey = req.headers.get("apikey") ?? "";
  if(apiKey != process.env['APIKEY']){
    return {"status" : "apikey header not valid"};
  }
}

app.get('/', () => 'Jai Shree Ram');

app.get('/chapters',async () =>  {
  var chapters = await file.json(); 
  for (var i = 0; i < chapters.length; i++) {
    var ch = chapters[i];
    chapters[i]["verses"] = {};
  }
  return chapters;
}, {
     beforeHandle: theChecker
} );


app.get('/verseof/:id',async ({ params: { id } }) => {
  var chapters = await file.json(); 

  var ch = chapters[id - 1];
  if(ch){
    return ch.verses;
  }else{
    return [];
  }
  
}, {
     beforeHandle: theChecker
});


app.get('/search/:query',async ({ params: { query } }) =>  {
  if(query){
  query = query.toLowerCase();
    
  var returnElement = { "chapters" : [],"verses":[] };
    
  var chapters = await file.json(); 
  for (var i = 0; i < chapters.length; i++) {
    var ch = chapters[i];
       if(ch.name_translated.toLowerCase().includes(query)){
         var ch_temp = ch;
         ch_temp.verses = {};
         returnElement.chapters.push(ch_temp);
       }
        if(ch.verses.length > 0){
            ch.verses.forEach((vr) =>  {
               if(vr.translations[0].description.toLowerCase().includes(query)){
                    returnElement.verses.push(vr);
                  }
            });
        }
  }
    
  return returnElement;
    
  }else{
    return { "chapters" : [],"verses":[] };
  }

} , {
     beforeHandle: theChecker
});



app.listen(3000);


console.log(`🦊 Elysia is running at on port ${app.server?.port}...`);