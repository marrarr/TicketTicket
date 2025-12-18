import { MigrationInterface, QueryRunner } from "typeorm";

export class PoprawaEncji1766078772849 implements MigrationInterface {
    name = 'PoprawaEncji1766078772849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rola\` CHANGE \`rola_id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`siedzenie\` DROP FOREIGN KEY \`FK_30dd52aea7d6dd7c703907a7b64\``);
        await queryRunner.query(`ALTER TABLE \`siedzenie\` CHANGE \`sala_id\` \`sala_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`seans\` DROP FOREIGN KEY \`FK_ae46c17c73862e7cdf64b73e320\``);
        await queryRunner.query(`ALTER TABLE \`seans\` CHANGE \`sala_id\` \`sala_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`sala\` ADD UNIQUE INDEX \`IDX_e15d2fdf16c95e6a4ad31d0d58\` (\`numer_sali\`)`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` DROP FOREIGN KEY \`FK_d52b9749a1821ceafdf3720115f\``);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` DROP FOREIGN KEY \`FK_36c81b2eb19acf44209957c0db4\``);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` DROP FOREIGN KEY \`FK_a845aa3f0d53035c80ffdabefed\``);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` DROP FOREIGN KEY \`FK_cdd58116a197522fd6e8f7fdcb7\``);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` CHANGE \`data_utworzenia\` \`data_utworzenia\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` CHANGE \`sala_id\` \`sala_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` CHANGE \`siedzenie_id\` \`siedzenie_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` CHANGE \`seans_id\` \`seans_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` CHANGE \`uzytkownik_id\` \`uzytkownik_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`siedzenie\` ADD CONSTRAINT \`FK_30dd52aea7d6dd7c703907a7b64\` FOREIGN KEY (\`sala_id\`) REFERENCES \`sala\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`seans\` ADD CONSTRAINT \`FK_ae46c17c73862e7cdf64b73e320\` FOREIGN KEY (\`sala_id\`) REFERENCES \`sala\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` ADD CONSTRAINT \`FK_d52b9749a1821ceafdf3720115f\` FOREIGN KEY (\`sala_id\`) REFERENCES \`sala\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` ADD CONSTRAINT \`FK_36c81b2eb19acf44209957c0db4\` FOREIGN KEY (\`siedzenie_id\`) REFERENCES \`siedzenie\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` ADD CONSTRAINT \`FK_a845aa3f0d53035c80ffdabefed\` FOREIGN KEY (\`seans_id\`) REFERENCES \`seans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` ADD CONSTRAINT \`FK_cdd58116a197522fd6e8f7fdcb7\` FOREIGN KEY (\`uzytkownik_id\`) REFERENCES \`uzytkownik\`(\`uzytkownik_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` DROP FOREIGN KEY \`FK_cdd58116a197522fd6e8f7fdcb7\``);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` DROP FOREIGN KEY \`FK_a845aa3f0d53035c80ffdabefed\``);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` DROP FOREIGN KEY \`FK_36c81b2eb19acf44209957c0db4\``);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` DROP FOREIGN KEY \`FK_d52b9749a1821ceafdf3720115f\``);
        await queryRunner.query(`ALTER TABLE \`seans\` DROP FOREIGN KEY \`FK_ae46c17c73862e7cdf64b73e320\``);
        await queryRunner.query(`ALTER TABLE \`siedzenie\` DROP FOREIGN KEY \`FK_30dd52aea7d6dd7c703907a7b64\``);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` CHANGE \`uzytkownik_id\` \`uzytkownik_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` CHANGE \`seans_id\` \`seans_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` CHANGE \`siedzenie_id\` \`siedzenie_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` CHANGE \`sala_id\` \`sala_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` CHANGE \`data_utworzenia\` \`data_utworzenia\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` ADD CONSTRAINT \`FK_cdd58116a197522fd6e8f7fdcb7\` FOREIGN KEY (\`uzytkownik_id\`) REFERENCES \`uzytkownik\`(\`uzytkownik_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` ADD CONSTRAINT \`FK_a845aa3f0d53035c80ffdabefed\` FOREIGN KEY (\`seans_id\`) REFERENCES \`seans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` ADD CONSTRAINT \`FK_36c81b2eb19acf44209957c0db4\` FOREIGN KEY (\`siedzenie_id\`) REFERENCES \`siedzenie\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rezerwacja\` ADD CONSTRAINT \`FK_d52b9749a1821ceafdf3720115f\` FOREIGN KEY (\`sala_id\`) REFERENCES \`sala\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sala\` DROP INDEX \`IDX_e15d2fdf16c95e6a4ad31d0d58\``);
        await queryRunner.query(`ALTER TABLE \`seans\` CHANGE \`sala_id\` \`sala_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`seans\` ADD CONSTRAINT \`FK_ae46c17c73862e7cdf64b73e320\` FOREIGN KEY (\`sala_id\`) REFERENCES \`sala\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`siedzenie\` CHANGE \`sala_id\` \`sala_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`siedzenie\` ADD CONSTRAINT \`FK_30dd52aea7d6dd7c703907a7b64\` FOREIGN KEY (\`sala_id\`) REFERENCES \`sala\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rola\` CHANGE \`id\` \`rola_id\` int NOT NULL AUTO_INCREMENT`);
    }

}
