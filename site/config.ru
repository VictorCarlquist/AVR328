use Rack::Static, 
  :root => "site/public"

run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('site/public/index.html', File::RDONLY)
  ]
}

