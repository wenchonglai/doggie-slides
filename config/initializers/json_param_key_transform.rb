ActionDispatch::Request.parameter_parsers[:json] = lambda { |raw_post|
  # Modified from action_dispatch/http/parameters.rb
  data = ActiveSupport::JSON.decode(raw_post)

  # Transform camelCase param keys to snake_case
  if data.is_a?(Array)
    data.map { |item| item.deep_transform_keys!(&:underscore) }
  else
    params.transform_keys!(&:underscore)
  end

  # Return data
  data.is_a?(Hash) ? data : { '_json': data }
}