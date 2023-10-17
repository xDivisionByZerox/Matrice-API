export class stats_post{
    constructor(id, nb_aime, achetable, nb_commentaires, prix){
        this.id = id;
        this.nb_aime = nb_aime;
        this.achetable = achetable;
        this.nb_commentaires = nb_commentaires;
        this.prix = prix;
    }

    get_id(){return id;}
    get_nb_aime(){return this.nb_aime;}
    get_achetable(){return this.achetable;}
    get_nb_commentaires(){return this.nb_commentaires;}
    get_prix(){return this.prix;}

    set_id(id){this.id = id;}
    set_nb_aime(nb_aime){this.nb_aime = nb_aime;}
    set_achetable(achetable){this.achetable = achetable;}
    set_nb_commentaires(nb_commentaires){this.nb_commentaires = nb_commentaires;}
    set_prix(prix){this.prix = prix;}

    to_json(){ return JSON.stringify(this); }
}