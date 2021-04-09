@textboxes.map do |textbox|
  json.set! textbox.id do
    json.partial! "text", textbox: textbox
  end
end