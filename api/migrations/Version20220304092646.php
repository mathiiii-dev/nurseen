<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220304092646 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE family (id INT AUTO_INCREMENT NOT NULL, parent_id INT NOT NULL, UNIQUE INDEX UNIQ_A5E6215B727ACA70 (parent_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE nurse (id INT AUTO_INCREMENT NOT NULL, nurse_id INT NOT NULL, UNIQUE INDEX UNIQ_D27E6D437373BFAA (nurse_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE family ADD CONSTRAINT FK_A5E6215B727ACA70 FOREIGN KEY (parent_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE nurse ADD CONSTRAINT FK_D27E6D437373BFAA FOREIGN KEY (nurse_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE family');
        $this->addSql('DROP TABLE nurse');
    }
}
