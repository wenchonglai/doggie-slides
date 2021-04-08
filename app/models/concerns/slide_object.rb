module SlideObject
  extend ActiveSupport::Concern
  
  included do
    has_one :wrapper, as: :slide_object, inverse_of: :slide_object, dependent: :destroy 
    accepts_nested_attributes_for :wrapper
    delegate :user, to: :wrapper
  end

  # instance methods here


  # class methods here
  module ClassMethods

    # this will become a class method
    # it should return all the elements that are tagged 'tag_name'
    # def by_tag_name(tag_name)
    #   self.joins(:tags).where('tags.name' => tag_name)
    # end
  end
end