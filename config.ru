use Rack::Static, 
  :urls => ["/css", "/doc","/java","/site","/img","Turing","/ace","/ace-builds","/ace-builds/src-noconflict/mode","/ace-builds/src-noconflict"],
  :root => "public"

run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('public/index.html', File::RDONLY)
  ]
}

