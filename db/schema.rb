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

ActiveRecord::Schema.define(version: 2021_04_13_222411) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "docs", force: :cascade do |t|
    t.integer "owner_id", null: false
    t.integer "share_id"
    t.string "filename", default: "Untitled presentation", null: false
    t.integer "width", default: 800, null: false
    t.integer "height", default: 500, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["owner_id"], name: "index_docs_on_owner_id"
    t.index ["share_id"], name: "index_docs_on_share_id"
  end

  create_table "images", force: :cascade do |t|
    t.integer "width", default: 0, null: false
    t.integer "height", default: 0, null: false
    t.float "x", default: 0.0, null: false
    t.float "y", default: 0.0, null: false
    t.float "rotate", default: 0.0, null: false
    t.float "scale_x", default: 0.0, null: false
    t.float "scale_y", default: 0.0, null: false
    t.string "style_string", default: ""
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "slides", force: :cascade do |t|
    t.integer "doc_id", null: false
    t.integer "page", default: 1, null: false
    t.boolean "skipped", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["doc_id", "page"], name: "index_slides_on_doc_id_and_page"
  end

  create_table "textboxes", force: :cascade do |t|
    t.text "text", default: ""
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "textstyles", force: :cascade do |t|
    t.integer "textbox_id", null: false
    t.text "style_string", default: "", null: false
    t.integer "offset", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["textbox_id", "offset"], name: "index_textstyles_on_textbox_id_and_offset"
    t.index ["textbox_id"], name: "index_textstyles_on_textbox_id"
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
    t.string "slide_object_type"
    t.bigint "slide_object_id"
    t.integer "z_index", default: 0, null: false
    t.float "width", default: 300.0, null: false
    t.float "height", default: 200.0, null: false
    t.float "x", default: 0.0, null: false
    t.float "y", default: 0.0, null: false
    t.float "rotate", default: 0.0, null: false
    t.float "crop_width", default: 0.0, null: false
    t.float "crop_height", default: 0.0, null: false
    t.float "crop_x", default: 0.0, null: false
    t.float "crop_y", default: 0.0, null: false
    t.string "fill"
    t.string "stroke"
    t.float "stroke_width", default: 0.0
    t.string "stroke_dasharray"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_id"], name: "index_wrappers_on_group_id"
    t.index ["slide_id"], name: "index_wrappers_on_slide_id"
    t.index ["slide_object_type", "slide_object_id"], name: "index_wrappers_on_slide_object_type_and_slide_object_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
end
