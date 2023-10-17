export class post{
    constructor(id, id_parent, id_createur, id_proprio, img, tags, texte){
        this.id = id; 
        this.id_parent = id_parent;
        this.id_createur = id_createur;
        this.id_proprio = id_proprio;
        this.img = img;
        this.tags = tags;
        this.texte = texte;
    }

    get_id(){ return this.id; }
    get_id_parent(){ return this.id_parent; }
    get_id_createur(){ return this.id_createur; }
    get_id_proprio(){ return this.id_proprio; }
    get_img(){ return this.img; }
    get_tags(){ return this.tags; }
    get_texte(){ return this.texte; }

    set_id( id ){ this.id = id; }
    set_id_parent( id_parent ){ this.id_parent = id_parent; }
    set_id_createur( id_createur ){ this.id_createur = id_createur; }
    set_id_proprio( id_proprio ){ this.id_proprio = id_proprio; }
    set_img( img ){ this.img = img; }
    set_tags( tags ){ this.tags = tags; }
    set_texte( texte ){ this.texte = texte; }

    to_json(){ return JSON.stringify(this); }
}