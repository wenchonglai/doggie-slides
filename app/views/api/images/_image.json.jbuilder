json.extract! image, :id, :width, :height, :translate_x, :translate_y, :rotate, :scale_x, :scale_y, :style_string
json.file url_for(image.file)