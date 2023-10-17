export class tag{
    constructor(id, nom){
        this.id = id;
        this.nom = nom;
    }

    get_id(){return id;}
    get_nom(){return this.nom;}

    set_id(id){ this.id = id; }
    set_nom(nom){ this.nom = nom; }

    to_json(){ return JSON.stringify(this); }
}