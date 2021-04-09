# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Textbox.destroy_all
User.destroy_all
Doc.destroy_all
Slide.destroy_all

nyan = User.create({email: 'nyanCat@nyan.nyan', password: "nyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyannyan", firstname: "Nyan", lastname: "Cat"});
nyan_doc = nyan.docs[0]

(1..10).each do |i|
  slide = Slide.create({doc_id: nyan_doc.id, page: i, skipped: false})
  
  Textbox.create!(
    text: (["Nyan"] * i).join(' '),
    wrapper_attributes: {slide_id: slide.id, z_index: 1, width: 800, height: 100},
    textstyles_attributes: [{style_string: "font: 60px Helvetica", offset: 0}]
  )
end
  
doge = User.create({email: 'demo@dmail.com', password: '123456', firstname: "Demo", lastname: "Doge"});
doge_slide = doge.slides[0];

Textbox.create!(
    text: "Thicc SVG textarea. So Demo, wow",
    wrapper_attributes: {slide_id: doge_slide.id, z_index: 1, width: 400, height: 100, translate_x: 200, translate_y: 200},
    textstyles_attributes: [{style_string: "font: 48px comic sans ms; fill: green", offset: 0}]
  );
