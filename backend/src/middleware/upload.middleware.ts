import multer from "multer";

const storage=multer.memoryStorage();

const fileFilter=(req:Express.Request,file:Express.Multer.File,cb:multer.FileFilterCallback)=>{
    const allowedTypes=["image/png","image/jpeg","image/webp","application/pdf"];
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(new Error("Invalid file type"));
    }
}

const upload=multer({
    storage,
    fileFilter,
    limits:{
        fileSize:10*1024*1024
    }
    
});

export default upload;