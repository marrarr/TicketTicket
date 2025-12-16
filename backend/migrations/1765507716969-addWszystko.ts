import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWszystko1765507716969 implements MigrationInterface {
    name = 'AddWszystko1765507716969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`rola\` (\`rola_id\` int NOT NULL AUTO_INCREMENT, \`nazwa\` varchar(50) NOT NULL, UNIQUE INDEX \`IDX_ebef26e61afea204deee459f6a\` (\`nazwa\`), PRIMARY KEY (\`rola_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`siedzenie\` (\`id\` int NOT NULL AUTO_INCREMENT, \`numer\` int NOT NULL, \`rzad\` int NOT NULL, \`sala_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`seans\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tytul_filmu\` varchar(255) NOT NULL, \`data\` date NOT NULL, \`godzina_rozpoczecia\` varchar(255) NOT NULL, \`sala_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sala\` (\`id\` int NOT NULL AUTO_INCREMENT, \`numer_sali\` int NOT NULL, \`ilosc_miejsc\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rezerwacja\` (\`id\` int NOT NULL AUTO_INCREMENT, \`klient\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`data_utworzenia\` timestamp NOT NULL, \`uzytkownik_id\` int NOT NULL, \`sala_id\` int NULL, \`siedzenie_id\` int NULL, \`seans_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`uzytkownik\` (\`uzytkownik_id\` int NOT NULL AUTO_INCREMENT, \`imie\` varchar(100) NOT NULL, \`nazwisko\` varchar(100) NOT NULL, \`email\` varchar(255) NOT NULL, \`telefon\` varchar(20) NOT NULL, \`login\` varchar(100) NOT NULL, \`haslo\` varchar(255) NOT NULL, \`rola_id\` int NOT NULL, \`confirmed\` tinyint NOT NULL, UNIQUE INDEX \`IDX_1125ca20331763fe2a98e5ca93\` (\`email\`), UNIQUE INDEX \`IDX_ebaedb599fcf302e1777f8137d\` (\`login\`), PRIMARY KEY (\`uzytkownik_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`siedzenie\` ADD CONSTRAINT \`FK_30dd52aea7d6dd7c703907a7b64\` FOREIGN KEY (\`sala_id\`) REFERENCES \`sala\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`seans\` ADD CONSTRAINT \`FK_ae46c17c73862e7cdf64b73e320\` FOREIGN KEY (\`sala_id\`) REFERENCES \`sala\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` ADD CONSTRAINT \`FK_d52b9749a1821ceafdf3720115f\` FOREIGN KEY (\`sala_id\`) REFERENCES \`sala\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` ADD CONSTRAINT \`FK_36c81b2eb19acf44209957c0db4\` FOREIGN KEY (\`siedzenie_id\`) REFERENCES \`siedzenie\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` ADD CONSTRAINT \`FK_a845aa3f0d53035c80ffdabefed\` FOREIGN KEY (\`seans_id\`) REFERENCES \`seans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` ADD CONSTRAINT \`FK_cdd58116a197522fd6e8f7fdcb7\` FOREIGN KEY (\`uzytkownik_id\`) REFERENCES \`uzytkownik\`(\`uzytkownik_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`uzytkownik\` ADD CONSTRAINT \`FK_68e69961362ef4e0a0a77f12ca9\` FOREIGN KEY (\`rola_id\`) REFERENCES \`rola\`(\`rola_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`uzytkownik\` DROP FOREIGN KEY \`FK_68e69961362ef4e0a0a77f12ca9\``);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` DROP FOREIGN KEY \`FK_cdd58116a197522fd6e8f7fdcb7\``);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` DROP FOREIGN KEY \`FK_a845aa3f0d53035c80ffdabefed\``);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` DROP FOREIGN KEY \`FK_36c81b2eb19acf44209957c0db4\``);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` DROP FOREIGN KEY \`FK_d52b9749a1821ceafdf3720115f\``);
        await queryRunner.query(`ALTER TABLE \`seans\` DROP FOREIGN KEY \`FK_ae46c17c73862e7cdf64b73e320\``);
        await queryRunner.query(`ALTER TABLE \`siedzenie\` DROP FOREIGN KEY \`FK_30dd52aea7d6dd7c703907a7b64\``);
        await queryRunner.query(`DROP INDEX \`IDX_ebaedb599fcf302e1777f8137d\` ON \`uzytkownik\``);
        await queryRunner.query(`DROP INDEX \`IDX_1125ca20331763fe2a98e5ca93\` ON \`uzytkownik\``);
        await queryRunner.query(`DROP TABLE \`uzytkownik\``);
        await queryRunner.query(`DROP TABLE \`rezerwacja\``);
        await queryRunner.query(`DROP TABLE \`sala\``);
        await queryRunner.query(`DROP TABLE \`seans\``);
        await queryRunner.query(`DROP TABLE \`siedzenie\``);
        await queryRunner.query(`DROP INDEX \`IDX_ebef26e61afea204deee459f6a\` ON \`rola\``);
        await queryRunner.query(`DROP TABLE \`rola\``);
    }

}
