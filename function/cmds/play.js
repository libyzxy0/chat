const { Innertube, UniversalCache, Utils } = require("youtubei.js"); 
 const fs = require("fs"); 
 module.exports = async ({ api, input }) => { 
   const prefix = '/';
   let data = input.split(" "); 
   if (data.length < 2) { 
     api.sendMessage( 
       `⚠️Invalid Use Of Command!\n💡Usage: ${prefix}play <title of music>`, "text"); 
   } else { 
     try { 
       data.shift(); 
       const yt = await Innertube.create({ 
         cache: new UniversalCache(false), 
         generate_session_locally: true, 
       }); 
       const search = await yt.music.search(data.join(" "), { type: "video" }); 
       if (search.results[0] === undefined) { 
         return api.sendMessage("Audio not found!", "text"); 
       } 
       const info = await yt.getBasicInfo(search.results[0].id); 
       const url = info.streaming_data?.formats[0].decipher(yt.session.player); 
     api.sendMessage({ attachment: { url }}, "audio")    
     } catch (err) { 
       console.log(err)
       //api.sendMessage(`Error ${err}`, "text"); 
     } 
   } 
 };