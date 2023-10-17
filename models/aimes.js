export class aime {
    constructor(id, id_utilisateur, id_post){
        this.id = id;
        this.id_utilisateur = id_utilisateur;
        this.id_post = id_post;
    }
    
    get_id(){return id;}
    get_id_utilisateur(){return this.id_utilisateur;}
    get_id_post(){return this.id_post;}
    
    set_id(id){ this.id = id; }
    set_id_utilisateur(id_utilisateur){ this.id_utilisateur = id_utilisateur; }
    set_id_post(id_post){ this.id_post = id_post; }
    
    to_json(){ return JSON.stringify(this); }
}