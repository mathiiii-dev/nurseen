<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220512113955 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE link_code DROP FOREIGN KEY FK_C652A2317373BFAA');
        $this->addSql('DROP INDEX IDX_C652A2317373BFAA ON link_code');
        $this->addSql('ALTER TABLE link_code DROP nurse_id, DROP expiration');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE link_code ADD nurse_id INT NOT NULL, ADD expiration DATETIME NOT NULL');
        $this->addSql('ALTER TABLE link_code ADD CONSTRAINT FK_C652A2317373BFAA FOREIGN KEY (nurse_id) REFERENCES nurse (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_C652A2317373BFAA ON link_code (nurse_id)');
    }
}
