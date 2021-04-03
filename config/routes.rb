              #   api_users POST   /api/users(.:format)                                                                     api/users#create {:format=>:json}
              #    api_user GET    /api/users/:id(.:format)                                                                 api/users#show {:format=>:json}
              #             DELETE /api/users/:id(.:format)                                                                 api/users#destroy {:format=>:json}
              # api_session DELETE /api/session(.:format)                                                                   api/sessions#destroy {:format=>:json}
              #             POST   /api/session(.:format)                                                                   api/sessions#create {:format=>:json}
              #        root GET    /                                                                                        static_pages#root

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api, defaults: {format: :json} do
    get '/users/search', to: 'users#search'
    resources :users, only: [:create, :destroy, :show, :index]
    resource :session, only: [:create, :destroy]
  end
  
  root to: 'static_pages#root'
end
