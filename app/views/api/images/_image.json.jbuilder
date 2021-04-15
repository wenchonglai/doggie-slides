json.extract! image, :id, :width, :height, :x, :y, :rotate, :scale_x, :scale_y, :style_string
json.href url_for(image.file)