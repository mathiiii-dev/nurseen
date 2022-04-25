<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220411150646 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE menu ADD nurse_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE menu ADD CONSTRAINT FK_7D053A937373BFAA FOREIGN KEY (nurse_id) REFERENCES nurse (id)');
        $this->addSql('CREATE INDEX IDX_7D053A937373BFAA ON menu (nurse_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE menu DROP FOREIGN KEY FK_7D053A937373BFAA');
        $this->addSql('DROP INDEX IDX_7D053A937373BFAA ON menu');
        $this->addSql('ALTER TABLE menu DROP nurse_id');
    }
}
