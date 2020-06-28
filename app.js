var bodyParser=require("body-parser"),
    override=require("method-override"),
    sanitizer=require("express-sanitizer"),
    mongoose=require("mongoose"),
    express=require("express"),
    app=express();
    
//app config
mongoose.connect("mongodb+srv://Raj:1234@blog-app.fmkkq.mongodb.net/Blog-app?retryWrites=true&w=majority");
app.use(express.static("public"));
app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
app.use(override("_method"));

// mongo config
var blogschema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type: Date, default: Date.now}
});

var Blog=mongoose.model("Blog",blogschema);

// Blog.create({
//     title:"About Life",
//     image:"https://images.unsplash.com/photo-1505816014357-96b5ff457e9a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=891&q=80",
//     body:"Life is DIVINE SOUL"
// });
//routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});
//index route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err)
        {
            console.log("ERROR");
        }
        else{
        res.render("index",{blogs:blogs});
        }
    });
});
//new route
app.get("/blogs/new",function(req,res){
   res.render("new"); 
});
//post route to blogs(index)
//create route
app.post("/blogs",function(req,res){
    //create blog
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newblog)
    {
       if(err){
           res.render("new");
       } 
       else{
           res.redirect("/blogs");
       }
    });
});
//show rooute
app.get("/blogs/:id",function(req, res) {
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:foundblog});
        }
    });
});
//edit route
app.get("/blogs/:id/edit",function(req, res) {
    Blog.findById(req.params.id,function(err,foundblog)
    {
        if(err){
            res.redirect("/blogs");
        }    
        else{
            res.render("edit",{blog:foundblog});
        }
    });
});
//update
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateblog){
      if(err){
          res.redirect("/blogs");
      } 
      else{
          res.redirect("/blogs/"+req.params.id);
      }   });
});
//delete
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});
app.listen(process.env.PORT || 3000,function(){
    console.log("Blog_App started");
})