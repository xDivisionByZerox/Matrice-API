export class grade{
    constructor(id, nom, prix){
        this.id = id;
        this.nom = nom;
        this.prix = prix;
    }

    get_id(){return id;}
    get_nom(){return this.nom;}
    get_prix(){return this.prix;}

    set_id(id){ this.id = id; }
    set_nom(nom){ this.nom = nom; }
    set_prix(prix){ this.prix = prix; }

    to_json(){ return JSON.stringify(this); }
}