class User < ApplicationRecord
  attr_reader :password

  before_validation :ensure_session_token

  validates :email, :session_token, {presence: true, uniqueness: true}
  validates :password_digest, {presence: true}
  validates :password, {length: {minimum: 8}, allow_nil: true}
  validates_format_of :email, {with: /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/}
  
  def self.find_by_credentials(email, password)
    @user = User.find_by(email: email)
p [email, @user]
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
end
