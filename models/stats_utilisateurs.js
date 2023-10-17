export class stats_utilisateur{
    constructor(id, nb_abonnes, nb_abonnements, nb_coins, nb_posts){
        this.id = id;
        this.nb_abonnes = nb_abonnes;
        this.nb_abonnements = nb_abonnements;
        this.nb_coins = nb_coins;
        this.nb_posts = nb_posts;
    }

    get_id(){return this.id;}
    get_nb_abonnes(){return this.nb_abonnes;}
    get_nb_abonnements(){return this.nb_abonnements;}
    get_nb_coins(){return this.nb_coins;}
    get_nb_posts(){return this.nb_posts;}

    set_id(id){this.id = id;}
    set_nb_abonnes(nb_abonnes){this.nb_abonnes = nb_abonnes;}
    set_nb_abonnements(nb_abonnements){this.nb_abonnements = nb_abonnements;}
    set_nb_coins(nb_coins){this.nb_coins = nb_coins;}
    set_nb_posts(nb_posts){this.nb_posts = nb_posts;}

    to_json(){ return JSON.stringify(this); }
}