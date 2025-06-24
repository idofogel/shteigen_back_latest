class UpdateNodeController < ApplicationController
    skip_before_action :verify_authenticity_token, only: [:updtend,:updatearch, :deletearch]
    def updtend
        new_pars = params[:update_node]
        new_id = new_pars[:id_num].to_i
        new_module = new_pars[:module].to_i
        puts new_pars
        Node.where(id_num: new_id,module: new_module).update(caption: new_pars[:name], content: new_pars[:txt], module: new_pars[:module].to_i, level: new_pars[:placey].to_i)
        # render json: Node.all, status: :ok
        render json: [status:'success'], status: :ok
    end
    def updatearch
        new_pars = params[:arch_to_update]
        new_id = params[:id_num].to_i
        new_name = params[:name_to_update]
        new_module = params[:module].to_i
        Arch.where(id_num: new_id,module: new_module).update(caption: new_name)
    end
    def deletearch
        new_id = params[:id_num].to_i
        new_module = params[:module].to_i
        Arch.where(id_num: new_id,module: new_module).delete_all
    end
end

