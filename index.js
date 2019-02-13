const express = require( 'express' )
const multer  = require( 'multer' )
const path = require( 'path' )
const fs = require( 'fs' )

const app = express()

const createDir = ( folderPath ) =>
  new Promise( ( resolve, reject ) => {
    fs.exists( folderPath, ( exists ) => {
      if ( !exists ) {
        fs.mkdir( ( folderPath ), { recursive: true }, ( err ) => {
          return err ? resolve() : reject( err )
        } )
      } else {
        resolve()
      }
    } )
  } )

const storage = multer.diskStorage( {
  destination : ( req, file, cb ) => {
    const { userId, entityType } = req.query
    const folderPath = path.join( __dirname + `/uploads/${ userId }/${ entityType }` )
    return createDir( folderPath )
      .then( () => cb( null, folderPath ) )
      .catch( ( err ) => {
        console.error( err )
      } )
  },
  filename : ( req, file, cb ) => {
    const { entityId } = req.query;
    cb( null, `${ entityId }_${ file.originalname }` )
  }
} )

const upload = multer( {  storage: storage } )

app.post( '/upload', upload.single( 'file' ), ( req, res, next ) => {
  res.sendStatus( 201 )
} )

app.get( '/', ( req, res ) => {
  res.sendFile( path.join( __dirname + '/index.html' ) )
} )

app.listen( 8080, () => {
  console.log( 'serving on 8080')
} )
