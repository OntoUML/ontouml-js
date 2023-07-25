import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { generateAlloy, generateFact, generateFun, generateWorldFieldForClass, generateWorldFieldForRelation, generateWorldFact } from './helpers';
import { Class, ClassStereotype, Relation, Package, Project, Property, OntoumlType, AggregationKind, stereotypeUtils, OntologicalNature } from '@libs/ontouml';


describe('property_functions', () => {

    let project: Project;
    let model: Package;
    let transformer: Ontouml2Alloy;

    beforeEach(() => {
        project = new Project();
        model = project.createModel();
    });

    describe('datatype properties', () => {

        it('should transform an attribute of a datatype with default (zero-to-many) multiplicity', () => {
            const Date = model.createDatatype('Date');
            const Integer = model.createDatatype('Integer');
            Date.createAttribute(Integer, 'day');

            const result = generateAlloy(model);

            expect(result).toContain('sig Date in Datatype {\n        day: set Integer\n}');
        });

        it('should transform an attribute of a datatype with one-to-many multiplicity', () => {
            const Invoice = model.createDatatype('Invoice');
            const InvoiceLine = model.createDatatype('InvoiceLine');
            const lines = Invoice.createAttribute(InvoiceLine, 'lines');
            lines.cardinality.setOneToMany();

            const result = generateAlloy(model);

            expect(result).toContain('sig Invoice in Datatype {\n        lines: some InvoiceLine\n}');
        });

        it('should transform an attribute of a datatype with zero-to-one multiplicity', () => {
            const User = model.createDatatype('User');
            const Name = model.createDatatype('Name');
            const middleName = User.createAttribute(Name, 'middleName');
            middleName.cardinality.setZeroToOne();

            const result = generateAlloy(model);

            expect(result).toContain('sig User in Datatype {\n        middleName: lone Name\n}');
        });

        it('should transform an attribute of a datatype with one-to-one multiplicity', () => {
            const Person = model.createDatatype('Person');
            const Date = model.createDatatype('Date');
            const dob = Person.createAttribute(Date, 'dateOfBirth');
            // dob.cardinality.setLowerBoundFromNumber(1);
            // dob.cardinality.setUpperBoundFromNumber(1);
            dob.cardinality.setOneToOne();

            const result = generateAlloy(model);

            expect(result).toContain('sig Person in Datatype {\n        dateOfBirth: one Date\n}');
        });

        it('should transform an attribute of a datatype with custom (28..31) multiplicity', () => {
            const Month = model.createDatatype('Month');
            const Day = model.createDatatype('Day');
            const days = Month.createAttribute(Day, 'days');
            days.cardinality.setLowerBoundFromNumber(28);
            days.cardinality.setUpperBoundFromNumber(31);

            const result = generateAlloy(model);

            expect(result).toContain('sig Month in Datatype {\n        days: Day\n}');
            expect(result).toContain(generateFact('multiplicity', ['all x: Month | #x.days>=28 and #x.days<=31']));
        });

        it('should transform an attribute of a datatype with exact number (3..3) multiplicity)', () => {
            const Triangle = model.createDatatype('Triangle');
            const Side = model.createDatatype('Side');
            const sides = Triangle.createAttribute(Side, 'sides');
            sides.cardinality.setLowerBoundFromNumber(3);
            sides.cardinality.setUpperBoundFromNumber(3);

            const result = generateAlloy(model);

            expect(result).toContain('sig Triangle in Datatype {\n        sides: Side\n}');
            expect(result).toContain(generateFact('multiplicity', ['all x: Triangle | #x.sides=3']));
        });

        it('should generate "datatypesMultiplicity fact for a relation between datatypes with default cardinality', () => {
            const sourceClass = model.createDatatype('Date');
            const targetClass = model.createDatatype('String');
            const relation = model.createBinaryRelation(sourceClass, targetClass);

            const result = generateAlloy(model);

            expect(result).toContain(generateFact('datatypesMultiplicity', ['all x: Date | #x.relation>=0', 'all x: String | #relation.x>=0']));
        });

        it('should generate "datatypesMultiplicity fact for a relation between datatypes with custom cardinality', () => {
            const Patient = model.createDatatype('Patient');
            const HealthRecord = model.createDatatype('HealthRecord');
            const hasHealthRecord = model.createBinaryRelation(Patient, HealthRecord, 'hasHealthRecord');

            hasHealthRecord.getTargetEnd().cardinality.setLowerBoundFromNumber(1);

            const result = generateAlloy(model);

            expect(result).toContain(generateFact('datatypesMultiplicity', ['all x: Patient | #x.hasHealthRecord>=1', 'all x: HealthRecord | #hasHealthRecord.x>=0']));
        });


    });

    describe('class attributes', () => {

        it('should generate an "immutable_target" for a read-only attribute', () => {
            const person = model.createKind('Person');
            const string = model.createDatatype('String');
            const name = person.createAttribute(string, 'name');
            name.isReadOnly = true; // indicating that the name attribute is read-only

            const result = generateAlloy(model);

            expect(result).toContain(generateFact('relationProperties', ['immutable_target[Person,name]']));
        });

        describe('ordered attributes', () => {

            it('should generate an "ordering" fact for an ordered attribute', () => {
                const playlist = model.createKind('Playlist');
                const song = model.createDatatype('Song');
                const songs = playlist.createAttribute(song, 'songs');
                songs.isOrdered = true; // indicating that the songs in the playlist are ordered

                const result = generateAlloy(model);

                expect(result).toContain(generateFact('ordering', ['all w: World, x: w.Playlist | isSeq[x.(w.songs)]', 'all w: World, x: w.Playlist, y: w.Playlist | lone x.((w.songs).y)']));
            });

            it('should transform an ordered attribute of a class with default (zero-to-many) multiplicity', () => {
                const playlist = model.createKind('Playlist');
                const song = model.createDatatype('Song');
                const songs = playlist.createAttribute(song, 'songs');
                songs.isOrdered = true; // indicating that the songs in the playlist are ordered

                const result = generateAlloy(model);

                expect(result).toContain('songs: set Playlist set -> set Int set -> set Song');
                expect(result).toContain('fun songs1 [x: World.Playlist, w: World] : set Song {\n        x.(w.songs)\n}');
            });

            it('should transform an ordered attribute of a class with one-to-many multiplicity', () => {
                const Course = model.createKind('Course');
                const Topic = model.createDatatype('Topic');
                const topics = Course.createAttribute(Topic, 'topics');
                topics.isOrdered = true;
                topics.cardinality.setOneToMany();

                const result = generateAlloy(model);

                expect(result).toContain('topics: set Course set -> set Int set -> some Topic');
                expect(result).toContain('fun topics1 [x: World.Course, w: World] : set Topic {\n        x.(w.topics)\n}');
            });

            it('should transform an ordered attribute of a class with zero-to-one multiplicity', () => {
                const Project = model.createKind('Project');
                const Milestone = model.createDatatype('Milestone');
                const nextMilestone = Project.createAttribute(Milestone, 'nextMilestone');
                nextMilestone.isOrdered = true;
                nextMilestone.cardinality.setZeroToOne();

                const result = generateAlloy(model);

                expect(result).toContain('nextMilestone: set Project set -> set Int set -> lone Milestone');
                expect(result).toContain('fun nextMilestone1 [x: World.Project, w: World] : set Milestone {\n        x.(w.nextMilestone)\n}');
            });

            it('should transform an ordered attribute of a class with one-to-one multiplicity', () => {
                const Student = model.createKind('Student');
                const Task = model.createDatatype('Task');
                const currentTask = Student.createAttribute(Task, 'currentTask');
                currentTask.isOrdered = true;
                currentTask.cardinality.setOneToOne();

                const result = generateAlloy(model);

                expect(result).toContain('currentTask: set Student set -> set Int set -> one Task');
                expect(result).toContain('fun currentTask1 [x: World.Student, w: World] : set Task {\n        x.(w.currentTask)\n}');
            });

            it('should generate a "multiplicity" fact for an ordered attribute with exact range (2..2) multiplicity', () => {
                const Person = model.createKind('Person');
                const ContactInformation = model.createDatatype('ContactInformation');
                const contactInformation = Person.createAttribute(ContactInformation, 'contactInformation');
                contactInformation.isOrdered = true;
                contactInformation.cardinality.setLowerBoundFromNumber(2); // setting the lower bound of the cardinality to 2
                contactInformation.cardinality.setUpperBoundFromNumber(2); // setting the upper bound of the cardinality to 2

                const result = generateAlloy(model);

                expect(result).toContain(generateFact('multiplicity', ['all w: World, x: w.Person | #contactInformation1[x,w]=2']));
            });

            it('should generate a "multiplicity" fact for an ordered attribute with custom cardinlaity', () => {
                const playlist = model.createKind('Playlist');
                const song = model.createDatatype('Song');
                const songs = playlist.createAttribute(song, 'songs');
                songs.isOrdered = true; // indicating that the songs in the playlist are ordered

                songs.cardinality.setLowerBoundFromNumber(1);
                songs.cardinality.setUpperBoundFromNumber(31); //playlist needs to have between 1 and 31 songs

                const result = generateAlloy(model);

                expect(result).toContain(generateFact('multiplicity', ['all w: World, x: w.Playlist | #songs1[x,w]>=1 and #songs1[x,w]<=31']));
            });
        });

        describe('unordered attributes', () => {

            it('should transform an unordered attribute with default (zero-to-many) multiplicity', () => {
                const bag = model.createKind('Bag');
                const item = model.createDatatype('Item');
                const items = bag.createAttribute(item, 'items');

                const result = generateAlloy(model);

                expect(result).toContain('items: set Bag set -> set Item');
                expect(result).toContain('fun items1 [x: World.Bag, w: World] : set Item {\n        x.(w.items)\n}')
            });

            it('should transform an unordered attribute with one-to-many multiplicity', () => {
                const Family = model.createKind('Family');
                const Member = model.createKind('Member');
                const members = Family.createAttribute(Member, 'members');
                members.cardinality.setOneToMany();

                const result = generateAlloy(model);

                expect(result).toContain('members: set Family set -> some Member');
                expect(result).toContain('fun members1 [x: World.Family, w: World] : set Member {\n        x.(w.members)\n}');
            });


            it('should transform an unordered attribute of a class with zero-to-one multiplicity', () => {
                const Person = model.createKind('Person');
                const Spouse = model.createKind('Spouse');
                const spouse = Person.createAttribute(Spouse, 'spouse');
                spouse.cardinality.setZeroToOne();

                const result = generateAlloy(model);

                expect(result).toContain('spouse: set Person set -> lone Spouse');
                expect(result).toContain('fun spouse1 [x: World.Person, w: World] : set Spouse {\n        x.(w.spouse)\n}');
            });

            it('should transform an unordered attribute of a class with one-to-one multiplicity', () => {
                const Car = model.createKind('Car');
                const Engine = model.createKind('Engine');
                const engine = Car.createAttribute(Engine, 'engine');
                engine.cardinality.setOneToOne();

                const result = generateAlloy(model);

                expect(result).toContain('engine: set Car set -> one Engine');
                expect(result).toContain('fun engine1 [x: World.Car, w: World] : set Engine {\n        x.(w.engine)\n}');
            });

            it('should generate a "multiplicity" fact for an unordered attribute with exact range (2..2) multiplicity', () => {
                const person = model.createKind('Person');
                const address = model.createDatatype('address');
                const homeAddress = person.createAttribute(address, 'homeAddress');
                homeAddress.cardinality.setLowerBoundFromNumber(2); // setting the lower bound of the cardinality to 2
                homeAddress.cardinality.setUpperBoundFromNumber(2); // setting the upper bound of the cardinality to 2

                const result = generateAlloy(model);

                expect(result).toContain(generateFact('multiplicity', ['all w: World, x: w.Person | #homeAddress1[x,w]=2']));
            });

            it('should generate a "multiplicity" fact for an unordered attribute with custom (1..3) multiplicity', () => {
                const person = model.createKind('Person');
                const address = model.createDatatype('address');
                const homeAddress = person.createAttribute(address, 'homeAddress');
                homeAddress.cardinality.setLowerBoundFromNumber(1); // setting the lower bound of the cardinality to 1
                homeAddress.cardinality.setUpperBoundFromNumber(3); // setting the upper bound of the cardinality to 3

                const result = generateAlloy(model);

                expect(result).toContain(generateFact('multiplicity', ['all w: World, x: w.Person | #homeAddress1[x,w]>=1 and #homeAddress1[x,w]<=3']));
            });

        });

    });

    describe('relation ends', () => {

        describe('source end', () => {

            it('should transform a source end with default (zero-to-many) cardinality', () => {
                const Order = model.createKind('Order');
                const Product = model.createKind('Product');
                const contains = model.createBinaryRelation(Order, Product, 'contains');

                const result = generateAlloy(model);

                expect(result).toContain('contains: set Order set -> set Product');
                expect(result).toContain('fun Order1 [x: World.Product, w: World] : set World.Order {\n        (w.contains).x\n}')
            });

            it('should transform a source end with one-to-many cardinality', () => {
                const Employer = model.createKind('Employer');
                const Employee = model.createKind('Employee');
                const employs = model.createBinaryRelation(Employer, Employee, 'employs');
                employs.getSourceEnd().cardinality.setOneToMany();

                const result = generateAlloy(model);

                expect(result).toContain('employs: set Employer some -> set Employee');
                expect(result).toContain('fun Employer1 [x: World.Employee, w: World] : set World.Employer {\n        (w.employs).x\n}')
            });

            it('should transform a source end with zero-to-one cardinality', () => {
                const Person = model.createKind('Person');
                const House = model.createKind('House');
                const livesIn = model.createBinaryRelation(Person, House, 'livesIn');
                livesIn.getSourceEnd().cardinality.setZeroToOne();

                const result = generateAlloy(model);

                expect(result).toContain('livesIn: set Person lone -> set House');
                expect(result).toContain('fun Person1 [x: World.House, w: World] : set World.Person {\n        (w.livesIn).x\n}')
            });

            it('should transform a source end with one-to-one cardinality', () => {
                const Husband = model.createKind('Husband');
                const Wife = model.createKind('Wife');
                const marriedTo = model.createBinaryRelation(Husband, Wife, 'marriedTo');
                marriedTo.getSourceEnd().cardinality.setOneToOne();

                const result = generateAlloy(model);

                expect(result).toContain('marriedTo: set Husband one -> set Wife');
                expect(result).toContain('fun Husband1 [x: World.Wife, w: World] : set World.Husband {\n        (w.marriedTo).x\n}')
            });

            it('should transform a source end with exact number cardinality', () => {
                const Team = model.createKind('Team');
                const Player = model.createKind('Player');
                const hasPlayers = model.createBinaryRelation(Team, Player, 'hasPlayers');
                hasPlayers.getSourceEnd().cardinality.setCardinalityFromNumbers(11, 11);

                const result = generateAlloy(model);

                expect(result).toContain('hasPlayers: set Team -> set Player');
                expect(result).toContain('fun Team1 [x: World.Player, w: World] : set World.Team {\n        (w.hasPlayers).x\n}')
                expect(result).toContain(generateFact('multiplicity', ['all w: World, x: w.Player | #Team1[x,w]=11']));
            });

            it('should transform a source end with specific range cardinality', () => {
                const Course = model.createKind('Course');
                const Student = model.createKind('Student');
                const enrolled = model.createBinaryRelation(Course, Student, 'enrolled');
                enrolled.getSourceEnd().cardinality.setCardinalityFromNumbers(1, 50);

                const result = generateAlloy(model);

                expect(result).toContain('enrolled: set Course -> set Student');
                expect(result).toContain('fun Course1 [x: World.Student, w: World] : set World.Course {\n        (w.enrolled).x\n}')
                expect(result).toContain(generateFact('multiplicity', ['all w: World, x: w.Student | #Course1[x,w]>=1 and #Course1[x,w]<=50']));
            });

            it('should generate an "immutable_source" for a read-only source end of a relation', () => {
                const Person = model.createKind('Person');
                const Car = model.createKind('Car');
                const owns = model.createBinaryRelation(Person, Car, 'owns');
                owns.getSourceEnd().isReadOnly = true;
                const result = generateAlloy(model);
                expect(result).toContain(generateFact('relationProperties', ['immutable_source[Car,owns]']));
            });


        });

        describe('target end', () => {

            it('should transform a target end with default (zero-to-many) cardinality', () => {
                const Order = model.createKind('Order');
                const Product = model.createKind('Product');
                const contains = model.createBinaryRelation(Order, Product, 'contains');

                const result = generateAlloy(model);

                expect(result).toContain('contains: set Order set -> set Product');
                expect(result).toContain('fun Product1 [x: World.Order, w: World] : set World.Product {\n        x.(w.contains)\n}');
            });

            it('should transform a target end with one-to-many cardinality', () => {
                const Employer = model.createKind('Employer');
                const Employee = model.createKind('Employee');
                const employs = model.createBinaryRelation(Employer, Employee, 'employs');
                employs.getTargetEnd().cardinality.setOneToMany();

                const result = generateAlloy(model);

                expect(result).toContain('employs: set Employer set -> some Employee');
                expect(result).toContain('fun Employee1 [x: World.Employer, w: World] : set World.Employee {\n        x.(w.employs)\n}');
            });

            it('should transform a target end with zero-to-one cardinality', () => {
                const Person = model.createKind('Person');
                const House = model.createKind('House');
                const livesIn = model.createBinaryRelation(Person, House, 'livesIn');
                livesIn.getTargetEnd().cardinality.setZeroToOne();

                const result = generateAlloy(model);

                expect(result).toContain('livesIn: set Person set -> lone House');
                expect(result).toContain('fun House1 [x: World.Person, w: World] : set World.House {\n        x.(w.livesIn)\n}');
            });

            it('should transform a target end with one-to-one cardinality', () => {
                const Husband = model.createKind('Husband');
                const Wife = model.createKind('Wife');
                const marriedTo = model.createBinaryRelation(Husband, Wife, 'marriedTo');
                marriedTo.getTargetEnd().cardinality.setOneToOne();

                const result = generateAlloy(model);

                expect(result).toContain('marriedTo: set Husband set -> one Wife');
                expect(result).toContain('fun Wife1 [x: World.Husband, w: World] : set World.Wife {\n        x.(w.marriedTo)\n}');
            });

            it('should transform a target end with exact number cardinality', () => {
                const Team = model.createKind('Team');
                const Player = model.createKind('Player');
                const hasPlayers = model.createBinaryRelation(Team, Player, 'hasPlayers');
                hasPlayers.getTargetEnd().cardinality.setCardinalityFromNumbers(11, 11);

                const result = generateAlloy(model);

                expect(result).toContain('hasPlayers: set Team set -> Player'); //perhhaps better to have a 'set' before 'Player'
                expect(result).toContain('fun Player1 [x: World.Team, w: World] : set World.Player {\n        x.(w.hasPlayers)\n}');
                expect(result).toContain(generateFact('multiplicity', ['all w: World, x: w.Team | #Player1[x,w]=11']));
            });

            it('should transform a target end with specific range cardinality', () => {
                const Course = model.createKind('Course');
                const Student = model.createKind('Student');
                const enrolled = model.createBinaryRelation(Course, Student, 'enrolled');
                enrolled.getTargetEnd().cardinality.setCardinalityFromNumbers(1, 50);

                const result = generateAlloy(model);

                expect(result).toContain('enrolled: set Course set -> Student'); //perhaps better to have a 'set' before 'Student'
                expect(result).toContain('fun Student1 [x: World.Course, w: World] : set World.Student {\n        x.(w.enrolled)\n}');
                expect(result).toContain(generateFact('multiplicity', ['all w: World, x: w.Course | #Student1[x,w]>=1 and #Student1[x,w]<=50']));
            });

            it('should generate an "immutable_target" for a read-only target end of a relation', () => {
                const Person = model.createKind('Person');
                const Car = model.createKind('Car');
                const owns = model.createBinaryRelation(Person, Car, 'owns');
                owns.getTargetEnd().isReadOnly = true;

                const result = generateAlloy(model);

                expect(result).toContain(generateFact('relationProperties', ['immutable_target[Person,owns]']));
            });

        });

        it('should generate multiplicity facts for a material relation (connected to a derivation) despite non-custom cardinality', () => {
            const organization = model.createKind('Organization');
            const employee = model.createRole('Employee');
            const employment = model.createRelator('Employment');
            const materialRelation = model.createMaterialRelation(organization, employee, 'hires');
            model.createMediationRelation(employment, organization);
            model.createMediationRelation(employment, employee);
            model.createDerivationRelation(materialRelation, employment);

            const result = generateAlloy(model);
            expect(result).toContain('hires: set Organization -> Employment -> Employee');
            expect(result).toContain(generateFact('multiplicity', ['all w: World, x: w.Employee | #Organization2[x,w]>=1']));
            expect(result).toContain(generateFact('multiplicity', ['all w: World, x: w.Organization | #Employee2[x,w]>=0']));
        });


    });




});