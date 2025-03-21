const express=require('express');
const app=express();
const multer=require('multer');
const path=require('path');
const cors=require('cors');
const axios=require('axios');
const CLOUDCONVERT_API_KEY='eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZjg5MjljODI2NDYxZmQ5NTBlZTI3YjhkM2U1MWU3ODJjMmQzOGJmMzkxYmQxOWFkNDgwMWUwNzY1MGJhYWIzOTk2NmU5NGE0Y2QyMDM5OGEiLCJpYXQiOjE3NDAxMzM5ODcuOTc5MzQsIm5iZiI6MTc0MDEzMzk4Ny45NzkzNDEsImV4cCI6NDg5NTgwNzU4Ny45NzUyMzIsInN1YiI6IjY4MjI2MzUxIiwic2NvcGVzIjpbInVzZXIucmVhZCIsInVzZXIud3JpdGUiLCJ0YXNrLnJlYWQiLCJ0YXNrLndyaXRlIiwid2ViaG9vay5yZWFkIiwid2ViaG9vay53cml0ZSIsInByZXNldC5yZWFkIiwicHJlc2V0LndyaXRlIl19.r3hiNMwdi2TeE9dc2MIn-mDtwwEnRm1hpyRMjip9DHH_sD9YApcA-uP_FPaoDFfxc8jihFgp69e3Pl-DxVw_7ugqVU2_FdOsyF26ZL3ytb7jG28BuEBza3anESK-Qy_Y1MNtVvvtoFJ4OYz4QgDvPGKMpiLjpcRHWbOXnaVZa4csPx9NM6hp5SIjOH38434tWLlIuI9CSeHrcyCd1QxM4SQwveg2hEGZm43yw7EoOtjs4ea2OVwmUZh9DE0Dr2pUyHzANR-ARrKkbBYaBGspwKLAPAVrz6Cu3JW1eX1NpNR0HlcVrW2sgxCuaBx2KmW4NW8Zipd49Bqq1YtiCCpUR_xXxdm9Q01WN6tqcD60IQkDH9ueCkLHHe9UjHmFVz0fQ-73LMQ7LnSnsLrMPNsLKbRUsAl_kGGcPdjDJ8n84PyIrassi0qfHFQUDKQv3_OV7aC9UOYubgKxpueDQ0U02bBhBbA5LghRHIXUk3haiSU1DCTVgSsFa-VLKOu0oSlcQXPE9DXf0sd2TpIexPPlWmnJchL9_2PrU9v2uMX9osF2CEueB3HP_7NYQTHqA2vL2uxx5j_iFwPnWWIW8Uj-BkV0N9hPvwu8DaCgscvZ-U3b7xO4cREhCFTsxNyD_LL3NBNi7XcF7myrNF_1hoMoYBVBYwWbRkTQITffItlM_eo';
app.use(cors());
const port=3001;
const fs = require('fs');
const convertapi=require('convertapi')('secret_FIZBnZH5myzbM3gB');
const { Document, Packer, Paragraph, ImageRun } = require("docx");
// const sharp=require('sharp');
// const aw = require("@aspose/words");
const FormData = require("form-data");

   
    const storage = multer.diskStorage({
        destination: "uploads",
        filename: (req, file, cb) => {
          cb(null, file.originalname);  // Keep the original filename
        }
      });
      

      const uploads=multer({storage:storage});

 app.post('/convertFile/docx-to-pdf', uploads.single('file'), async(req,res,next)=>{
        try{
        if(!req.file){
            res.status(400).send('Please upload a file');
        }
        const docxfile=req.file.path;
        console.log(` uploaded file ${docxfile}`);
        const outputdir="downloads";
        const outputfile=path.join(outputdir, `${path.basename(docxfile,".docx")}.pdf`);
        console.log(outputfile);

        const result= await convertapi.convert('pdf', {File:docxfile}, 'docx');
         await result.saveFiles(outputfile);
        // await result.saveFiles(outputfile);

        fs.unlinkSync(docxfile);


         res.download(outputfile,(err)=>{
            if(err){
                console.log("error occurred",err);
                fs.unlinkSync(docxfile);

            }
            console.log("file downloaded");
         })
         
    }catch(err){
        console.log("error occurred",err);
    }
  
 })

 app.post('/convertFile/docx-to-jpg', uploads.single("file"), async (req, res,next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        console.log(req.file);
        const docxPath = req.file.path;
        const outputDir = "downloads";
        const outputFile = path.join(outputDir, `${path.basename(docxPath, ".docx")}.jpg`); 

         const result=await convertapi.convert("jpg", {File:docxPath}, "docx");
            await result.saveFiles(outputFile);

        // Download the first converted image (modify if multiple pages)
        res.download(outputFile, (err) => {
            if (err) {
                console.error("Error sending file:", err);
            } else {
                console.log("File downloaded successfully");
            }
        });

    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/convertFile/docx-to-png', uploads.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const docxPath = req.file.path;
        const outputDir = "downloads";
        const {name}=path.parse(docxPath);
        // const outputFile = path.join(outputDir, `${path.basename(docxPath, ".docx")}.png`); //for lowercase
          const outputFile=path.join(outputDir,`${name}.png`)
         const result=await convertapi.convert("png", {File:docxPath}, "docx");
            await result.saveFiles(outputFile);

        // Download the first converted image (modify if multiple pages)
        res.download(outputFile, (err) => {
            if (err) {
                console.error("Error sending file:", err);
            } else {
                console.log("File downloaded successfully");
            }
        });

    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

 app.post('/convertFile/pdf-to-docx', uploads.single('file'), async(req,res,next)=>{
        try{
        if(!req.file){
            res.status(400).send('Please upload a file');
        }
        const pdfFile=req.file.path;
        console.log(pdfFile);
        const outputdir="downloads";
        const outputfile=path.join(outputdir, `${path.basename(pdfFile,".pdf")}.docx`);
        console.log(outputfile);

        const result= await convertapi.convert('docx', {File:pdfFile}, 'pdf');
         await result.saveFiles(outputfile);
        // await result.saveFiles(outputfile);

         res.download(outputfile,(err)=>{
            if(err){
                console.log("error occurred",err);
            }
            console.log("file downloaded");
         })
         
    }catch(err){
        console.log("error occurred",err);
    }
  
 })

 app.post('/convertFile/pdf-to-jpg', uploads.single('file'), async(req,res,next)=>{
        try{
        if(!req.file){
            res.status(400).send('Please upload a file');
        }
        const pdfFile=req.file.path;
        console.log(pdfFile);
        const outputdir="downloads";
        const outputfile=path.join(outputdir, `${path.basename(pdfFile,".pdf")}.jpg`);
        console.log(outputfile);

        const result= await convertapi.convert('jpg', {File:pdfFile}, 'pdf');
         await result.saveFiles(outputfile);
        // await result.saveFiles(outputfile);

         res.download(outputfile,(err)=>{
            if(err){
                console.log("error occurred",err);
            }
            console.log("file downloaded");
         })
         
    }catch(err){
        console.log("error occurred",err);
    }
  
 })

 app.post('/convertFile/pdf-to-png', uploads.single('file'), async(req,res,next)=>{
        try{
        if(!req.file){
            res.status(400).send('Please upload a file');
        }
        const pdfFile=req.file.path;
        console.log(pdfFile);
        const outputdir="downloads";
        const outputfile=path.join(outputdir, `${path.basename(pdfFile,".pdf")}.png`);
        console.log(outputfile);

        const result= await convertapi.convert('png', {File:pdfFile}, 'pdf');
         await result.saveFiles(outputfile);
        // await result.saveFiles(outputfile);

         res.download(outputfile,(err)=>{
            if(err){
                console.log("error occurred",err);
            }
            console.log("file downloaded");
         })
         
    }catch(err){
        console.log("error occurred",err);
    }
  
 })




app.post("/convertFile/jpg-to-docx", uploads.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const imagePath = req.file.path; // Path to the uploaded image
        console.log("Received image:", imagePath);
        const imageBuffer = fs.readFileSync(imagePath); // Read image as buffer
       
        console.log("Image buffer:", imageBuffer);

        // Create a DOCX document with the image
        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        children: [
                            new ImageRun({
                                data: imageBuffer,
                                transformation: { width: 500, height: 500 },
                                type:"jpeg",
                            }),
                        ],
                    }),
                ],
            }],
        });
    console.log(req.file);
        // Generate DOCX as a buffer
        const buffer = await Packer.toBuffer(doc);

        // Set response headers for file download
        res.setHeader("Content-Disposition", 'attachment; filename="output.docx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

        // Send DOCX file as response
        res.send(buffer);

        // Clean up uploaded file
        // fs.unlinkSync(imagePath);
        res.on("finish", () => {
            fs.unlinkSync(imagePath);
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.post('/convertFile/jpg-to-pdf', uploads.single('file'), async(req,res,next)=>{
    try{
    if(!req.file){
    res.status(400).send('Please upload a file');
    }
    const jpgfile=req.file.path;
    console.log(jpgfile);
    const outputdir="downloads";
    const { name } = path.parse(jpgfile); 


    //Another way to extract extension from filename and work with extension
    // const extension = path.extname(jpgfile).toLowerCase().replace('.', ''); // Extract correct extension
    // const result = await convertapi.convert('png', { File: jpgfile }, extension);
    

    const outputfile=path.join(outputdir, `${name}.pdf`);
    console.log(outputfile);


   
      const result= await convertapi.convert('pdf', {File:jpgfile}, 'jpg');
        await result.saveFiles(outputfile);
        res.download(outputfile,(err)=>{
            if(err){
                console.log("error occurred",err);
            }
            console.log("file downloaded");
        })
    }catch(err){
        console.log("error occurred",err);
    }
})

app.post('/convertFile/jpg-to-png', uploads.single('file'), async(req,res,next)=>{


    try{
    if(!req.file){
        res.status(400).send('Please upload a file');
    }

    const jpgfile=req.file.path;
    console.log(jpgfile);
    const outputdir="downloads";

    const { name } = path.parse(jpgfile);  //desructuring the 'path' object
    // const outputfile=path.join(outputdir, `${path.basename(jpgfile,".jpg")}.png`);  //work only for lowercase extension
    const outputfile = path.join(outputdir, `${name}.png`);  //work for both lowercase and uppercase extension

    console.log(outputfile);
    const result= await convertapi.convert('png', {File:jpgfile}, 'jpg');
    await result.saveFiles(outputfile);
    res.download(outputfile,(err)=>{
        if(err){
            console.log("error occurred",err);
        }
        console.log("file downloaded");
    })
}catch(err){
    console.log("error occurred",err);
}
});




app.post("/convertFile/png-to-docx", uploads.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const pngPath = req.file.path; // Path to uploaded PNG
        const outputDir = path.join(__dirname, "converted");

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        //   const { name } = path.parse(pngPath);  // finding name using destructuring the 'path' object
         const name=path.parse(pngPath).name;  // finding name by extracting name from path object 
        const outputDocxPath = path.join(outputDir, `${name}.docx`);
       

        // Read the image into a buffer
        const imageBuffer = fs.readFileSync(pngPath);

        // Create a new Aspose.Words Document
        const doc = new aw.Document();
        const builder = new aw.DocumentBuilder(doc);

        // 🔹 Fix: Insert image **directly** from buffer (No Base64 conversion needed)
        builder.insertImage(imageBuffer);

        // Save the document as DOCX
        await doc.save(outputDocxPath);

        // Send the converted file as a response
        res.download(outputDocxPath, "converted.docx", (err) => {
            if (err) console.error("Error sending file:", err);
        });

        // Cleanup: Delete files **after response is sent**
        res.on("finish",  async () => {
            await fs.unlinkSync(pngPath);
            await fs.unlinkSync(outputDocxPath);
            console.log("Temporary files deleted.");
        });


        // await cleanupFiles([pngPath, outputDocxPath]); //  Another way Cleanup temp files

    } catch (error) {
        console.error("Error converting PNG to DOCX:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post('/convertFile/png-to-pdf', uploads.single('file'), async(req,res,next)=>{
    try{
    if(!req.file){
        res.status(400).send('Please upload a file');
    }
    const pngfile=req.file.path;
    console.log(pngfile);
    const outputdir="downloads";
    const outputfile=path.join(outputdir, `${path.basename(pngfile,".png")}.pdf`);
    console.log(outputfile);

    const result= await convertapi.convert('pdf', {File:pngfile}, 'png');
     await result.saveFiles(outputfile);
    // await result.saveFiles(outputfile);

     res.download(outputfile,(err)=>{
        if(err){
            console.log("error occurred",err);
        }
        console.log("file downloaded");
     })
     
}catch(err){
    console.log("error occurred",err);
}
})

app.post('/convertFile/png-to-jpg', uploads.single('file'), async(req,res,next)=>{
    try{
    if(!req.file){
        res.status(400).send('Please upload a file');
    }
    const pngfile=req.file.path;
    console.log(pngfile);
    const outputdir="downloads";
    const outputfile=path.join(outputdir, `${path.basename(pngfile,".png")}.jpg`);
    console.log(outputfile);

    const result= await convertapi.convert('jpg', {File:pngfile}, 'png');
     await result.saveFiles(outputfile);
    // await result.saveFiles(outputfile);

     res.download(outputfile,(err)=>{
        if(err){
            console.log("error occurred",err);
        }
        console.log("file downloaded");
        fs.unlink(outputfile, (unlinkErr) => {
            if (unlinkErr) {
                console.error("Error deleting file:", unlinkErr);
            } else {
                console.log("File deleted after download");
            }
     })
     
});
}catch(err){
    console.log("error occurred",err);
}
})


    //how to use cleanupFiles function
// cleanupFiles([jpgpath,outputDir]); // Call the function to cleanup files

// 🛠️ Utility: Cleanup Temporary Files
// const cleanupFiles = async (files) => {
//     try {
//         await Promise.all(files.map(file => fs.rm(file, { force: true })));
//         console.log("Temporary files deleted.");
//     } catch (err) {
//         console.error("Error deleting temp files:", err);
//     }
// };

 app.listen(3001,()=>{
 console.log("Server is  listening on port 3001");
});