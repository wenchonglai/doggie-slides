json.extract! image, :id, :width, :height, :x, :y, :rotate, :scale_x, :scale_y, :style_string
json.href image.file.attached? ? url_for(image.file) : nil  