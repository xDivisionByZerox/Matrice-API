export class utilisateur{
    constructor(id, pseudo, mail, password, nom, prenom, img, biographie,
                date_naissance, id_grade){
        this.id = id;
        this.pseudo = pseudo;
        this.mail = mail;
        this.password = password;
        this.nom = nom;
        this.prenom = prenom;
        this.img = img;
        this.biographie = biographie;
        this.date_naissance = date_naissance;
        this.id_grade = id_grade;
    }

    get_id(){return this.id}
    get_pseudo(){return this.pseudo;}
    get_mail(){return this.mail;}
    get_password(){return this.password;}
    get_nom(){return this.nom;}
    get_prenom(){return this.prenom;}
    get_img(){return this.img;}
    get_biographie(){return this.biographie;}
    get_date_naissance(){return this.date_naissance;}
    get_id_grade(){return this.id_grade;}

    set_id(id){this.id = id;}
    set_pseudo(pseudo){this.pseudo = pseudo;}
    set_mail(mail){this.mail = mail;}
    set_password(password){this.password = password;}
    set_nom(nom){this.nom = nom;}
    set_prenom(prenom){this.prenom = prenom;}
    set_img(img){this.img = img;}
    set_biographie(biographie){this.biographie = biographie;}
    set_date_naissance(date_naissance){this.date_naissance = date_naissance;}
    set_id_grade(id_grade){this.id_grade = id_grade;}

    to_json(){ return JSON.stringify(this); }
}