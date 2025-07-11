# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_05_30_154512) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "arches", force: :cascade do |t|
    t.string "caption"
    t.integer "id_num"
    t.integer "from"
    t.integer "to"
    t.integer "module"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "modulekinds", force: :cascade do |t|
    t.string "caption"
    t.integer "id_num"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "nodes", force: :cascade do |t|
    t.string "caption"
    t.text "content"
    t.integer "id_num"
    t.integer "module"
    t.integer "level"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end
end
