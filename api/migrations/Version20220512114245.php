<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220512114245 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE link_code ADD nurse_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE link_code ADD CONSTRAINT FK_C652A2317373BFAA FOREIGN KEY (nurse_id) REFERENCES nurse (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C652A2317373BFAA ON link_code (nurse_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE link_code DROP FOREIGN KEY FK_C652A2317373BFAA');
        $this->addSql('DROP INDEX UNIQ_C652A2317373BFAA ON link_code');
        $this->addSql('ALTER TABLE link_code DROP nurse_id');
    }
}
