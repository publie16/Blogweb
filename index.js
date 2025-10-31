import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
const currentHour = new Date().getHours();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
let posts=[];

app.get("/", (req,res) => {
    res.render("index.ejs",{data:"pubali"});
})

app.get("/new",(req,res)=>{
    res.render("newpost.ejs",{time:currentHour});
})

app.post("/post", (req, res) => {
  const now = Date.now();
  const newPost = {
    id: Date.now(), 
    title: req.body["newtitle"],
    content: req.body["newpost"],
    desc: req.body["newdesc"],
    time:new Date(now).toString(),
    category:req.body["category"]
  };
  console.log(newPost);
  posts.push(newPost); 
  res.redirect("/profileposts"); 
});


app.get("/profileposts", (req, res) => {
  res.render("posts.ejs", { posts }); 
});

app.post("/filter", (req, res) => {
  const selectedCategory = req.body.category;
  const filteredPosts = posts.filter(post => post.category === selectedCategory);
  console.log(selectedCategory);
  console.log(filteredPosts);
  if (filteredPosts.length > 0) {
    res.render("posts.ejs", { posts: filteredPosts });
  } else {
    res.render("posts.ejs", { posts: [] });
  }
});

app.get("/editpost/:id",(req,res)=>{
   const id = Number(req.params.id);
  const post = posts.find(p => p.id === id);

  if (post) {
    res.render("editpost.ejs", { post });
  } else {
    res.status(404).send("Post not found");
  }
})

app.post("/editpost/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = posts.findIndex(p => p.id === id);

  if (index !== -1) {
    posts[index].title = req.body.newtitle;
    posts[index].desc=req.body.newdesc;
    posts[index].content = req.body.newcontent;
    res.redirect("/profileposts");
  } else {
    res.status(404).send("Post not found");
  }
});


app.get("/viewpost/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find(p => p.id === id);

  if (post) {
    res.render("viewpost.ejs", { post });
  } else {
    res.status(404).send("Post not found");
  }
});
app.delete("/deletepost/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = posts.findIndex(p => p.id === id);
  if (index !== -1) {
    posts.splice(index, 1); 
    res.sendStatus(200);
  } else {
    res.status(404).send("Post not found");
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});