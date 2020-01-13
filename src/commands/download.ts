import { Command, flags } from '@oclif/command';
import { prompt } from 'enquirer';
import { getHBSEpisodes } from '../utils';

export default class Download extends Command {
  static description = "download the animes you're looking for";

  static examples = [
    `$ horrible-subs-cli download --name=Sword Art Online --episode=9`,
    `$ horrible-subs-cli download --name=Sword Art Online --episodes=1-9`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    name: flags.string({ char: 'n', description: 'anime to search for' }),
    episodes: flags.string({
      char: 'e',
      description: 'episode(s) to search for',
    }),
    outDir: flags.string({
      char: 'o',
      description: 'The directory where you want to save the files',
    }),
  };

  async run() {
    const { flags } = this.parse(Download);
    let { name, episodes, outDir } = flags;

    if (!name) {
      // Prompt for name
      const nameResponse: { name: string } = await prompt({
        type: 'input',
        name: 'name',
        message: 'Which anime are you looking for ?',
      });

      name = nameResponse.name;
    }

    if (!episodes) {
      // Prompt for episodes
      const episodeResponse: { episodes: string } = await prompt({
        type: 'input',
        name: 'episodes',
        message: 'Which episode(s) are you looking for ?',
      });

      episodes = episodeResponse.episodes;
    }

    if (!outDir) {
      // Prompt for outDir
      const outDirResponse: { outDir: string } = await prompt({
        type: 'input',
        name: 'outDir',
        message: 'Where would you like to save your files ?',
        initial: '~/Downloads',
      });

      outDir = outDirResponse.outDir;
    }

    // Search for episodes in HBS
    const resp = await getHBSEpisodes(name, episodes);
    console.log(resp);

    // Download episodes if any is found to the ourDir
    // Print the list of episodes downloaded successfully and which fail
  }
}
