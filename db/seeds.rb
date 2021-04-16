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

(2..10).each do |i|
  slide = Slide.create({doc_id: nyan_doc.id, page: i, skipped: false})
  
  Textbox.create!(
    text: (["Nyan"] * i).join(' '),
    wrapper_attributes: {slide_id: slide.id, width: 800, height: 100},
    textstyles_attributes: [{style_string: "font: 60px Helvetica; fill: black", offset: 0}]
  )
end
  
doge = User.create({email: 'demo@dmail.com', password: '123456', firstname: "Demo", lastname: "Doge"});
doge_slide = doge.slides[0];

doge_image_file = URI.open('https://jka-lab-seeds.s3-us-west-1.amazonaws.com/doge-original.jpg');
doge_image_file.rewind

doge_image = Image.create(
  wrapper_attributes: {
    z_index: 0,
    slide_id: doge_slide.id
  },
);

doge_image.file.attach(io: doge_image_file, filename: 'doge.jpg');

Textbox.create(
  text: "wow",
  wrapper_attributes: {
    slide_id: doge_slide.id, x: 25, y: 25, width: 100, height: 50, fill: '#ff7f00', stroke: '#7f3f00', stroke_width: 8,
  },
  textstyles_attributes: [{style_string: "font: bold 40px comic sans ms; fill: #ff0000", offset: 0}]
);

Textbox.create(
  text: "wow",
  wrapper_attributes: {
    slide_id: doge_slide.id, x: 50, y: 50, width: 100, height: 50,
  },
  textstyles_attributes: [{style_string: "font: italic 40px comic sans ms; fill: #cfcf00", offset: 0}]
);

Textbox.create(
  text: "wow",
  wrapper_attributes: {
    slide_id: doge_slide.id, x: 75, y: 75, width: 100, height: 50,
  },
  textstyles_attributes: [{style_string: "font: 40px comic sans ms; fill: #00cf00; textDecoration: underline", offset: 0}]
);

Textbox.create(
  text: "wow",
  wrapper_attributes: {
    slide_id: doge_slide.id, x: 100, y: 100, width: 100, height: 50,
  },
  textstyles_attributes: [{style_string: "font: 40px Helvetica ms; fill: #0000ff", offset: 0}]
);





