import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import isImageURL from 'image-url-validator';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  // GOOD WORKS!!
  // app.get('/filteredimage/', async (req, res) => {
  //   let imageURL = req.query.image_url
  //   // res.send(imageURL);
  //   const isImageURL = require('image-url-validator').default;
  //   const isValidImageURL = await isImageURL(imageURL);
  //   if (isValidImageURL) {
  //     const filteredpath = await filterImageFromURL(imageURL)
  //     res.sendFile(filteredpath);
  //     if (res.status(200)) {
  //       console.log("all good man!");
  //     }
  //     // deleteLocalFiles([filteredpath]);
  //   } else {
  //     res.send("not a valid image path!");
  //   }
  // });

  //I DID IT!!
  app.get('/filteredimage/', async (req, res) => {
    let imageURL:string = req.query.image_url;
    // res.send(imageURL);
    const isImageURL = require('image-url-validator').default;
    const isValidImageURL = await isImageURL(imageURL);
    if (isValidImageURL) {
      const filteredpath = await filterImageFromURL(imageURL)
      res.status(200).sendFile(filteredpath);
      console.log(filteredpath);
      res.on('finish', function(){
        deleteLocalFiles([filteredpath]);
      })
    } else {
      res.status(400).send({ message: 'Not a valid image path!' });
    }
  });
  /**************************************************************************** */

  //! END @TODO1
 
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();