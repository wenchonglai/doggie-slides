# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
User.destroy_all
Doc.destroy_all
Slide.destroy_all

User.create({email: 'demo@dmail.com', password: '123456', firstname: "Demo", lastname: "User"});
User.create({email: 'bunny@dmail.com', password: 'carrots', firstname: "Judy", lastname: "Hopps"});

(1..9).each do |i|
  Slide.create({doc_id: 1, page: i, skipped: false})
end
