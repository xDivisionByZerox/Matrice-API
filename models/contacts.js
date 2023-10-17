export class contact{
    constructor(id, id_utilisateurA, id_utilisateurB){
        this.id = id;
        this.id_utilisateurA = id_utilisateurA;
        this.id_utilisateurB = id_utilisateurB;
    }

    get_id(){return id;}
    get_id_utilisateurA(){return this.id_utilisateurA;}
    get_id_utilisateurB(){return this.utilisateurB;}

    set_id(id){ this.id = id; }
    set_id_utilisateurA(id_utilisateurA){ this.id_utilisateurA = id_utilisateurA; }
    set_id_utilisateurB(id_utilisateurB){ this.id_utilisateurB = id_utilisateurB; }

    to_json(){ return JSON.stringify(this); }
}