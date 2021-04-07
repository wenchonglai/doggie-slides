# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_04_07_183452) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "docs", force: :cascade do |t|
    t.integer "owner_id", null: false
    t.integer "share_id"
    t.string "filename", default: "Untitled presentation", null: false
    t.integer "width", default: 1600, null: false
    t.integer "height", default: 1000, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["owner_id"], name: "index_docs_on_owner_id"
    t.index ["share_id"], name: "index_docs_on_share_id"
  end

  create_table "slides", force: :cascade do |t|
    t.integer "doc_id", null: false
    t.integer "page", default: 1, null: false
    t.boolean "skipped", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["doc_id", "page"], name: "index_slides_on_doc_id_and_page"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "firstname"
    t.string "lastname"
    t.string "session_token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["session_token"], name: "index_users_on_session_token", unique: true
  end

  create_table "wrappers", force: :cascade do |t|
    t.integer "group_id"
    t.integer "slide_id", null: false
    t.integer "object_id", null: false
    t.integer "order", null: false
    t.string "type", null: false
    t.integer "width", default: 150, null: false
    t.integer "height", default: 100, null: false
    t.string "transform_string"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_id"], name: "index_wrappers_on_group_id"
    t.index ["slide_id"], name: "index_wrappers_on_slide_id"
    t.index ["type", "object_id"], name: "index_wrappers_on_type_and_object_id", unique: true
  end

end
