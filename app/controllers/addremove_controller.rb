# app/controllers/addremove.rb
class AddremoveController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:addremv, :getnotes, :getmodules, :addmodels, :emptydbs, :rmvmodule]
  def addremv
    received_nodes = params[:nodestoadd]
    received_arches = params[:archestoadd]
    received_nodes_to_remove = params[:nodestormv]
    received_arches_to_remove = params[:archestormv]
    
    puts received_nodes
    unless received_nodes.nil?
      received_nodes.each do |dta|
        Node.where(caption: dta[:name], content: dta[:txt], id_num: dta[:id], module: dta[:module], level: dta[:placey]).first_or_create
      end
    end
    unless received_arches.nil?
      received_arches.each do |dta|
        Arch.where(caption:dta[:name],id_num: dta[:id],from:dta[:from],to: dta[:to],module: dta[:module]).first_or_create
      end
    end
    unless received_nodes_to_remove.nil?
      received_nodes_to_remove.each do |n| 
        Node.where(id_num: n,module: params[:module].to_i).delete_all
        # puts "arches to remove"
        # puts Arch.where(from: n).or(to: n)
        Arch.where(from: n,module: params[:module].to_i).or(Arch.where(to: n,module: params[:module].to_i)).delete_all
      end
    end
    unless received_arches_to_remove.nil?
      received_arches_to_remove.each do |dta|
        Arch.where(id_num: dta).delete_all
      end
    end
    
    # Node.delete_all
    # Arch.delete_all
    data = {type: 'success'}
    # Render a JSON response
    # render json: Node.all, status: :ok
    render json: [], status: :ok
  end
  def getnotes
    #     Node.delete_all
    # Arch.delete_all
    arch_data = Arch.where(module: params[:module].to_i).all
    node_data = Node.where(module: params[:module].to_i).all
    render json: {nodes: node_data, archs: arch_data}, status: :ok
  end
  def getmodules
    # Modulekind.where(caption:"qfwegr").delete_all
    render json: Modulekind.all, status: :ok
  end
  def addmodels
    Modulekind.where(caption: params[:caption], id_num: params[:id_num]).first_or_create
    data = {type: 'success'}
    # Render a JSON response
    render json: Modulekind.all, status: :ok
  end
  def emptydbs
    Modulekind.delete_all
    Arch.delete_all
    Node.delete_all
    render json: [state: 'success'], status: :ok
  end
  def rmvmodule
    Arch.where(module: params[:module]).delete_all
    Node.where(module: params[:module]).delete_all
    Modulekind.where(id_num: params[:module]).delete_all
    render json: [state: 'success'], status: :ok
  end
end
