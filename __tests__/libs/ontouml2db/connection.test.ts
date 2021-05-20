import { Project } from '@libs/ontouml';
import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';
import { StrategyType } from '@libs/ontouml2db/constants/StrategyType';
import { Ontouml2Db } from '@libs/ontouml2db/Ontouml2Db';
import { Ontouml2DbOptions } from '@libs/ontouml2db/Ontouml2DbOptions';

// ****************************************
//       M O D E L
// ****************************************

const project = new Project();
project.setName("Project1");
const model = project.createModel();
model.setName("test");

// CREATE CLASSES
model.createKind('ClassA');


describe('Test connections', () => {
  let options: Partial<Ontouml2DbOptions> = {
    mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
    //targetDBMS: DbmsSupported.H2,
    standardizeNames: true,
    generateSchema: false,
    generateObdaFile: false,
    generateConnection: true,
    generateIndexes: false,
    hostName: 'localhost/~',
    databaseName: 'RunExample',
    userConnection: 'sa',
    passwordConnection: 'sa',
    enumFieldToLookupTable: true
  };
  
  it('testing GENERIC connection', () => {
    options.targetDBMS = DbmsSupported.GENERIC_SCHEMA;

    let ontouml2Db = new Ontouml2Db(project, options);
    let files = ontouml2Db.run();

    expect(files.result.connection).toContain('jdbc.name=ontouml2-db00-ufes-nemo-000000000001');
    expect(files.result.connection).toContain('jdbc.url=localhost/~/RunExample');
    expect(files.result.connection).toContain('jdbc.driver=[PUT_DRIVE_HERE]');
    expect(files.result.connection).toContain('jdbc.user=sa');
    expect(files.result.connection).toContain('jdbc.password=sa');
  });

  it('testing H2 connection', () => {
    options.targetDBMS = DbmsSupported.H2;

    let ontouml2Db = new Ontouml2Db(project, options);
    let files = ontouml2Db.run();

    expect(files.result.connection).toContain('jdbc.url=jdbc:h2:tcp://localhost/~/RunExample');
    expect(files.result.connection).toContain('jdbc.driver=org.h2.Driver');
  });

  it('testing MySql connection', () => {
    options.targetDBMS = DbmsSupported.MYSQL;

    let ontouml2Db = new Ontouml2Db(project, options);
    let files = ontouml2Db.run();

    expect(files.result.connection).toContain('jdbc.url=jdbc:mysql:tcp://localhost/~/RunExample');
    expect(files.result.connection).toContain('jdbc.driver=org.mysql.Driver');
  });

  it('testing Oracle connection', () => {
    options.targetDBMS = DbmsSupported.ORACLE;

    let ontouml2Db = new Ontouml2Db(project, options);
    let files = ontouml2Db.run();

    expect(files.result.connection).toContain('jdbc.url=jdbc:oracle:tcp://localhost/~/RunExample');
    expect(files.result.connection).toContain('jdbc.driver=org.oracle.Driver');
  });

  it('testing Postgre connection', () => {
    options.targetDBMS = DbmsSupported.POSTGRE;

    let ontouml2Db = new Ontouml2Db(project, options);
    let files = ontouml2Db.run();

    expect(files.result.connection).toContain('jdbc.url=jdbc:postgre:tcp://localhost/~/RunExample');
    expect(files.result.connection).toContain('jdbc.driver=org.postgre.Driver');
  });

  it('testing SqlServer connection', () => {
    options.targetDBMS = DbmsSupported.SQLSERVER;

    let ontouml2Db = new Ontouml2Db(project, options);
    let files = ontouml2Db.run();

    expect(files.result.connection).toContain('jdbc.url=jdbc:sqlserver:tcp://localhost/~/RunExample');
    expect(files.result.connection).toContain('jdbc.driver=org.sqlserver.Driver');
  });

});