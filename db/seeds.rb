# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'open-uri'

Image.all do |image|
  image.file.purge
end

Textbox.destroy_all
User.destroy_all
Image.destroy_all
Doc.destroy_all
Slide.destroy_all

nyan = User.create({email: 'nyanCat@nyan.nyan', password: "nyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyan", firstname: "Nyan", lastname: "Cat"});
nyan_doc = nyan.docs[0]

(1..10).each do |i|
  slide = Slide.create({doc_id: nyan_doc.id, page: i, skipped: false})
  
  Textbox.create!(
    text: (["Nyan"] * i).join(' '),
    wrapper_attributes: {slide_id: slide.id, z_index: 1, width: 800, height: 100},
    textstyles_attributes: [{style_string: "font: 60px Helvetica; fill: black", offset: 0}]
  )
end
  
doge = User.create({email: 'demo@dmail.com', password: '123456', firstname: "Demo", lastname: "Doge"});
doge_slide = doge.slides[0];

doge_image_file = OpenURI.open_uri('https://jka-lab-seeds.s3-us-west-1.amazonaws.com/doge-original.jpg');
doge_image_file.rewind

doge_image = Image.create(
  wrapper_attributes: {
    slide_id: doge_slide.id
  },
);

Textbox.create!(
  text: "01234567890123456789",
  wrapper_attributes: {
    slide_id: doge_slide.id, z_index: 0, x: 100, y: 25, width: 600, height: 100},
  textstyles_attributes: [{style_string: "font: 40px comic sans ms; fill: green", offset: 0}]
);

doge_image.file.attach(io: doge_image_file, filename: 'doge.jpg');