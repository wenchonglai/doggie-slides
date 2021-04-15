#                    Prefix Verb   URI Pattern                                                                              Controller#Action
#          api_users_search GET    /api/users/search(.:format)                                                              api/users#search {:format=>:json}
#                 api_users GET    /api/users(.:format)                                                                     api/users#index {:format=>:json}
#                           POST   /api/users(.:format)                                                                     api/users#create {:format=>:json}
#                  api_user GET    /api/users/:id(.:format)                                                                 api/users#show {:format=>:json}
#                           DELETE /api/users/:id(.:format)                                                                 api/users#destroy {:format=>:json}
#               api_session DELETE /api/session(.:format)                                                                   api/sessions#destroy {:format=>:json}
#                           POST   /api/session(.:format)                                                                   api/sessions#create {:format=>:json}
#                      root GET    /                                                                                        static_pages#root
#        rails_service_blob GET    /rails/active_storage/blobs/:signed_id/*filename(.:format)                               active_storage/blobs#show
# rails_blob_representation GET    /rails/active_storage/representations/:signed_blob_id/:variation_key/*filename(.:format) active_storage/representations#show
#        rails_disk_service GET    /rails/active_storage/disk/:encoded_key/*filename(.:format)                              active_storage/disk#show
# update_rails_disk_service PUT    /rails/active_storage/disk/:encoded_token(.:format)                                      active_storage/disk#update
#      rails_direct_uploads POST   /rails/active_storage/direct_uploads(.:format)                                           active_storage/direct_uploads#create

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api, defaults: {format: :json} do
    resources :images, only: [:create, :update, :destroy, :show, :index]

    resources :wrappers, only: [:create, :destroy, :update]
    resources :texts, only: [:create, :destroy, :update, :show, :index]
    resources :textstyles, only: []
    resources :textboxes, only: [ :show]

    patch '/wrappers/move', to: 'wrappers#move'
    resources :wrappers, only: [:create, :destroy, :update, :show, :index]

    patch '/slides/move', to: 'slides#move'
    resources :slides, only: [:create, :destroy, :update, :show, :index]

    resources :docs, only: [:update, :show]

    get '/users/search', to: 'users#search'
    resources :users, only: [:create, :destroy, :show, :index]

    resource :session, only: [:create, :destroy]
  end
  
  root to: 'static_pages#root'
end
