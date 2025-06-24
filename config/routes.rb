Rails.application.routes.draw do
  get "home/index"
  get "nodes_of_module", to: "addremove#getnotes"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  root 'home#index'
  post "add_remove", to: "addremove#addremv"
  post "update_node", to: "update_node#updtend"
  post "update_arch", to: "update_node#updatearch"
    post "rmv_module", to: "addremove#rmvmodule"
  
  post "delete_arch", to: "update_node#deletearch"
  get "get_modules", to: "addremove#getmodules"
  post "save_module", to: "addremove#addmodels"
  get "clean_db", to: "addremove#emptydbs"
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
