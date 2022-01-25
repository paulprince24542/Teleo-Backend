function profileImage(file,vendorId,BucketName) {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/png"
  ) {
    var params = {
      Bucket: BucketName,
      Key: vendorId,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    return params;
  }else{
      return false
  }
}


function productImage(file,vendorId,BucketName) {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/png"
  ) {
    var params = {
      Bucket: BucketName,
      Key: vendorId,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    return params;
  }else{
      return false
  }
}


module.exports.productImage = productImage
module.exports.profileImage = profileImage