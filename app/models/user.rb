# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  email           :string           not null
#  password_digest :string           not null
#  firstname       :string
#  lastname        :string
#  session_token   :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class User < ApplicationRecord
  attr_reader :password

  before_validation :ensure_session_token
  after_create :ensure_doc!

  validates :email, :session_token, {presence: true, uniqueness: true}
  validates :password_digest, {presence: true}
  validates :password, {length: {minimum: 6}, allow_nil: true}
  validates_format_of :email, {with: /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/}

  has_many :docs, foreign_key: :owner_id, class_name: :Doc, dependent: :destroy
  has_many :slides, through: :docs, source: :slides
  has_many :wrappers, through: :slides
  has_many :textboxes, through: :slides
  has_many :textstyles, through: :textboxes
  
  def self.find_by_credentials(email, password)
    @user = User.find_by(email: email)

    return @user if @user && @user.is_password?(password)
  end

  def self.generate_session_token
    return SecureRandom::urlsafe_base64
  end
  
  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest) == password
  end

  def ensure_session_token
    self.session_token ||= User.generate_session_token
  end

  def reset_session_token!
    self.session_token = User.generate_session_token
    self.save!
    self.session_token
  end

  def logged_in?
    self.session_token;
  end

  private
  def ensure_doc!
    Doc.create!({owner_id: self.id, filename: "Thicc doc, so untitled. wow~"})
  end
end
